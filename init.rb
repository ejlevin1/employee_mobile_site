require 'rubygems'
require 'bundler/setup'
require 'sinatra'
require 'sinatra/reloader'   
require 'excon'
require 'json'

# following says to require all in the Gemfile so I don't have to require individually
# was playing with this and not sure it's not needed
Bundler.require

set :port, 3000
set :environment, ENV['RACK_ENV'].nil? || ENV['RACK_ENV'] =='' ? :development : ENV['RACK_ENV'].to_sym