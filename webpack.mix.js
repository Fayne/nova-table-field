let path = require('path');
let mix = require('laravel-mix');
let postcss = require('postcss-import');
let tailwindcss = require('tailwindcss');

mix.extend('nova', new require('laravel-nova-devtool'));

mix
  .disableNotifications()
  .setPublicPath('dist')
  .js('resources/js/field.js', 'js')
  .vue({ version: 3 })
  .nova('outl1ne/nova-table-field')
  .postCss('resources/css/entry.css', 'dist/css/', [postcss(), tailwindcss('tailwind.config.js')]);
