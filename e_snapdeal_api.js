
var snap_api = require('./laptops/snapdeal/snapdeal_api.js');
snap_api.initialize();
snap_api.requestModule('laptops','http://www.snapdeal.com/sitemap/computers/computers-laptops/sitemap_computers-laptops_0.xml');

