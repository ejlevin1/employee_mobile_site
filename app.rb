require_relative 'init'
require_relative 'lib/partials'

class App < Sinatra::Application

	enable :sessions
	disable :protection
	
	configure :development do 
		set :boss_data_server, 'http://127.0.0.1:9292/'
		set :internal_boss_data_server, 'http://127.0.0.1:9292/'
		# set :boss_data_server, 'http://frank-prodsup.lifetimefitness.com/api/'
		# set :internal_boss_data_server, 'http://frank-prodsup.lifetimefitness.com/api/'

		register Sinatra::Reloader
		set :reload_templates, true
	end

	configure :prodsup do 
		set :boss_data_server, 'http://frank-prodsup.lifetimefitness.com/api/'
		set :internal_boss_data_server, 'http://127.0.0.1/api/'
	end

	helpers do
		include Sinatra::Partials

		def ssoid
			session['ssoid']
		end

		def require_authenticated!
			redirect to('/login') if session['ssoid'].nil?
		end
	end

	get '/' do
		require_authenticated!
		render :erb, :index
	end

	get '/login' do
		redirect to('/') if !session['ssoid'].nil? && session['ssoid'] != ''
		render :erb, :login
	end

	get '/logout' do
	  	session.clear
	  	redirect to('/login')
	end

	get '/auth_callback' do
		redirect to('/login') if params['ssoid'].nil? || params['ssoid'] == ''
		session['ssoid'] = params['ssoid']
	  	redirect to('/')
	end

end