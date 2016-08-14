task(:default).clear
task :default do
  system 'rake --silent --tasks'
end

desc 'install gems with Bundler'
task :install do
  sh 'bundle install --path vendor/bundle'
end

desc 'start jekyll server'
task :preview do
  sh 'bundle exec jekyll serve --drafts --watch'
end
