require_relative 'init'

class App < Sinatra::Application

	enable :sessions
	disable :protection
	
	configure :development do 
		set :boss_data_server, 'http://frankqa.lifetimefitness.com/api/'
		set :internal_boss_data_server, 'http://127.0.0.1/api/'
		set :employee_login_url, 'https://myaccountps.mylt.com/myaccount/employeelogin'

		register Sinatra::Reloader
		set :reload_templates, true
	end

	configure :qa do 
		set :boss_data_server, 'http://frankqa.lifetimefitness.com/api/'
		set :internal_boss_data_server, 'http://127.0.0.1/api/'
		set :employee_login_url, 'https://myaccountps.mylt.com/myaccount/employeelogin'
	end

	before do
	  @boss_data_server = settings.boss_data_server
	end

	helpers do
	  def versioned_stylesheet(stylesheet)
	    "#{request.script_name}/css/#{stylesheet}.css"
	  end
	  def versioned_javascript(js)
	    "#{request.script_name}/js/#{js}.js"
	  end
	  def versioned_image(filename)
	    "#{request.script_name}/images/#{filename}"
	  end
	  def application_base_url
	  	ENV['RACK_ENV'] == 'production' ? 'https://' : 'http://' + "#{request.host_with_port}#{request.script_name}"
	  end
	end

	get '/' do
		render :erb, :index
	end

	get '/callback' do
		if(params[:status] == '511')
		  	redirect "#{request.script_name}/logout"
		elsif(params[:status] == '500')
		  	redirect "#{request.script_name}/?message=#{URI.escape(params[:msg])}"
		else
		  	redirect "#{request.script_name}/"
		end
	end

	get '/login' do
		redirect "#{request.script_name}/" if !session['ssoid'].nil? && session['ssoid'] != ''

		application_partner_id = "WSBossUser"
		redirect_url = "#{application_base_url}/auth_callback"

	    @login_iframe_url = "#{settings.employee_login_url}?application_partner_id=#{application_partner_id}&breakout=true&iframe=true"
	    @login_iframe_url << "&return_url=#{URI.escape(redirect_url + '?ssoid={ssos_id}')}"
	    @login_iframe_url << "&cancel_url=#{URI.escape(redirect_url + '?error=invalid&error_reason=The user cancelled the request.')}"

		render :erb, :login
	end

	get '/logout' do
	  	session.clear
	  	redirect "#{request.script_name}/"
	end

	get '/auth_callback' do
		redirect "#{request.script_name}/login" if params['ssoid'].nil? || params['ssoid'] == ''
		session['ssoid'] = params['ssoid']
	  	redirect "#{request.script_name}/"
	end

end