class HomeController < ApplicationController
	
  require 'base64'
  require 'hmac-sha1'
	require 'action_view'

	include ActionView::Helpers::NumberHelper

	@@s3_access_key = Rails.application.secrets.s3_access_key
	@@s3_secret_key = Rails.application.secrets.s3_secret_key
	@@s3_bucket = Rails.application.secrets.s3_bucket
	@@s3_region = Rails.application.secrets.s3_region
	@@s3_url = Rails.application.secrets.s3_url


	def get_files_as_tree

		response = s3_get_tree(params[:path] || '')

		render json: response

	end

	def create_folder

		folder_path = params[:folder_path]

		if folder_path.blank? == false
			if !folder_path.end_with?("/")
				folder_path += '/'
			end

			s3_client = get_s3_client

			s3_client.put_object({
			  bucket: @@s3_bucket,
			  key: folder_path, 
		  })

		end

		render json: nil
	end

	def delete_files

		s3_client = get_s3_client

		keys_to_delete = params[:files] || []

		(params[:folders]||[]).each{ |folder|

			resp = s3_client.list_objects(bucket: @@s3_bucket, prefix: folder)

			resp.contents.each{ |f|
				keys_to_delete << f[:key]
			}
		}

		s3_client.delete_objects({
		  bucket: @@s3_bucket, 
		  delete: { # required
		    objects: keys_to_delete.map{|key|
		    	{key:key}
		    }
		  }
		})

		render json: nil
	end

	def cut_paste_files

		copy_files(params[:files], params[:folders], params[:destination], true)

		render json: nil
	end


	def copy_paste_files

		copy_files(params[:files], params[:folders], params[:destination], false)

		render json: nil
	end


	def rename_file

		if params[:old_key] != params[:new_key]

			s3_client = get_s3_client

			resp = s3_client.copy_object({
			  bucket: @@s3_bucket,
			  copy_source: @@s3_bucket + '/'  + params[:old_key],
			  key: params[:new_key]
			})

			resp = s3_client.delete_object({
			  bucket: @@s3_bucket,
			  key: params[:old_key]
			})

		end

		render json: nil
	end

	def file_download_url

		s3 = Aws::S3::Resource.new({
			access_key_id: @@s3_access_key,
		  secret_access_key: @@s3_secret_key,
		  region: @@s3_region
		})

		obj = s3.bucket(@@s3_bucket).object(params[:key])

		url = obj.presigned_url(:get, expires_in: 4);

    render :text => url, :status => 200 and return

	end



	def sign_auth_upload

    hmac = HMAC::SHA1.new(@@s3_secret_key)
    
    hmac.update(params["to_sign"])

    encoded = Base64.encode64("#{hmac.digest}").gsub("\n",'')

    render :text => encoded, :status => 200 and return

	end

	private

		def copy_files p_files, p_folders, p_destination, delete_source = false

			s3_client = get_s3_client

			files_to_move = (p_files || []).map{|file|
				{
					source_key: file,
					destination: p_destination + file[file.rindex(/\//)+1..-1]
				}
			}

			(p_folders||[]).each{ |folder|

				resp = s3_client.list_objects(bucket: @@s3_bucket, prefix: folder)

				folder_prefix = ''

				last_slash_index = folder[0..-2].rindex(/\//)

				if last_slash_index != nil
					folder_prefix = folder[0..last_slash_index]
				end

				resp.contents.each{ |f|
					files_to_move << {
						source_key: f[:key],
						destination: p_destination + f[:key][folder_prefix.length..-1]
					}
				}
			}

			files_to_move.each{ |file|

				if file[:source_key] != file[:destination]

					resp = s3_client.copy_object({
					  bucket: @@s3_bucket,
					  copy_source: @@s3_bucket + '/'  + file[:source_key],
					  key: file[:destination]
					})

					if delete_source

						resp = s3_client.delete_object({
						  bucket: @@s3_bucket,
						  key: file[:source_key]
						})

					end

				end
			}
		end

		def s3_get_tree path

			s3_client = get_s3_client

			resp = s3_client.list_objects(bucket: @@s3_bucket, prefix: path, delimiter:'/')

			files = resp.contents.map{ |f|
				{
					key: f[:key],
					name: f[:key][path.length..-1],
					size: f[:size],
					size_pretty: number_to_human_size(f[:size])
				}
			}.select{|f|
				f[:name] != ''
			}

			folders = resp.common_prefixes.map{ |f|
				{
					full_path: f[:prefix],
					name: f[:prefix][path.length..-2],
				}
			}

			return { error: nil, files: files, folders: folders }

		end


		def get_s3_client

			Aws::S3::Client.new(
			  access_key_id: @@s3_access_key,
			  secret_access_key: @@s3_secret_key,
			  region: @@s3_region)

		end

end
