class HomeController < ApplicationController
	
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

	private

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
