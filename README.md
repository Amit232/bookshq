# bookshq
Repo for all stuff related to books

Windows Permissions
----------------------
These steps should help enable the mod_rewrite apache module for anyone running a local WAMP stack – Apache, MySQL & PHP on a Windows machine.


I needed to do this with a local WordPress website which was setup to serve a number of friendly URLs using the .htaccess file. As the mod_rewrite module was not enabled, this prevented the .htaccess file from doing any URL rewriting, causing an error 404 page not found error on the WordPress site.

To enable mod_rewrite, I went through the below steps:

Find and open the file .http.conf. This will be located in your Apache install folder. For me, the full path was C:Program Files (x86)Apache Software FoundationApache2.2conf
Make a backup of http.conf which you can restore from, if anything were to go wrong

Find the line #LoadModule rewrite_module modules/mod_rewrite.so and remove the hash ‘#’enable-mod-rewrite-1

Locate the block within the directory tags as indicated below and change to:
<directory />
Options All
  AllowOverride All
</directory>

enable-mod-rewrite-2
Find any additional occurrences of the line “AllowOverride None” and change it to “AllowOverride All”.

Finally, restart apache server and your browser. The .htaccess rewriting should now be working for any local website or WordPress install instead of displaying the page not found error.

https://lipis.github.io/bootstrap-sweetalert/
