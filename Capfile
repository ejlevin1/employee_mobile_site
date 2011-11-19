require 'capistrano/version'
require 'rubygems'
require 'capinatra'
load 'deploy' if respond_to?(:namespace) # cap2 differentiator

# set an app_class if you're using the more recent style of creating
# Sinatra apps, where app_class would be the name of your subclass
# of Sinatra::Base. if you're just requiring 'sinatra' and using the
# more traditional DSL style of Sinatra, then comment this line out.
set :app_class, 'App'

# standard settings
set :app_file, "app.rb"
set :application, "employee_mobile_site"

# environment settings
set :user, "bossadmin"
set :group, "deploy"
set :deploy_to, "/srv/www/vhosts/#{application}"
set :deploy_via, :remote_cache
default_run_options[:pty] = true

# scm settings
set :repository, "git@github.com:ejlevin1/employee_mobile_site.git"
set :scm, :git
set :git_enable_submodules, false

# where the apache vhost will be generated
set :apache_vhost_dir, "/srv/www/vhosts/#{application}/current/"
set :default_branch, 'master'

namespace :deploy do
  task :restart do
    run "touch #{current_path}/tmp/restart.txt"
  end
end

desc "qa environment"
task :qa do
  set :ssh_options,  { :forward_agent => true, :port => 22, :paranoid => false }

  set :domain, "frankqa.lifetimefitness.com"

  host = "mncoboss38"
  host = Capistrano::CLI.ui.ask("Host: ") { |q| q.default = host }

  host = "#{host}.ltfinc.net" if !host.index(/ltfinc/)
  puts "Deploying to [#{host}]"

  role :app,         host
  role :web,         host
  role :db,          host, :primary => true

  set :deploy_via,   :remote_cache
  set(:branch) { Capistrano::CLI.ui.ask("Branch: ") { |q| q.default = default_branch } }
  set :rack_env,   	'qa'
end

namespace :rvm do
  task :create_rvmrc do
  	run "echo \"rvm 1.9.2@frank_api\" > #{current_path}/.rvmrc"
  end

  task :trust_rvmrc do
    # run "/usr/local/rvm rvmrc trust #{current_path}"
  end
end

after "deploy", "rvm:create_rvmrc"
after "deploy", "rvm:trust_rvmrc"