/**
 * 百度搜藏采集器
 * User: q13
 * Date: 13-9-19
 * Time: 下午2:09
 */
var Crawler = require("crawler").Crawler,
    moment=require("moment"),
    request=require("request"),
    path=require("path"),
    fs=require('fs'),
    _=require('underscore');
var bakPath=path.normalize(__dirname+"/bak");
var bookmarks=[],
    configs=[];
var c = new Crawler({
    "maxConnections":100,
    "forceUTF8":true,
    // This will be called for each crawled page
    "callback":function(error,result,$) {}
});
for(var i=1;i<47;i++){
    configs.push({
        url: 'http://cang.baidu.com/qshansan/tag/%E5%85%A8%E9%83%A8%E5%88%86%E7%B1%BB?o=js&pn='+i+'&isp=0',
        headers:{
            "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Encoding":"gzip, deflate",
            "Accept-Language":"en-US,en;q=0.5",
            "Cookie":"BAIDUID=9376834B3D91B1CEE72286BA37189D7E:FG=1; BDUT=lqn99376834B3D91B1CEE72286BA37189D7E1373c771e021; BAIDU_WISE_UID=9977EB1E952F1D24248772DB7488D21E; H_PS_PSSID=2777_1447_2976_2981_3108; _BDSC=1; BDUSS=1BKYnFpTn5zZkNjSEVrLTBYVElscktJZUhMb3BNTENCZkRmUURWZnRsMDJVR0pTQVFBQUFBJCQAAAAAAAAAAAEAAABmX70vcXNoYW5zYW4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADbDOlI2wzpSS",
            "Host":"cang.baidu.com",
            "Referer":"http://cang.baidu.com/qshansan",
            "User-Agent":"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:23.0) Gecko/20100101 Firefox/23.0",
            "X-Requested-With":"XMLHttpRequest"
        },
        "json":false,
        "skipDuplicates":false,
        "cache":false,
        "jQuery":false,
        "autoWindowClose":true,
        "userAgent":"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:23.0) Gecko/20100101 Firefox/23.0",
        "callback":(function(i){
            return function(error,result,$){
                //不合法的json串，fuck
                var responseData=eval("(" + result.body + ')'),
                    items=responseData.items,
                    tempItems,
                    htmlStr;
                if(items.length>0){
                    //bookmarks=bookmarks.concat(items);
                    bookmarks.push({
                        "weight":i,
                        "items":items
                    });
                    console.log('第'+i+'次记录...');
                    if(bookmarks.length==46){
                        tempItems=[];
                        htmlStr='<!DOCTYPE NETSCAPE-Bookmark-file-1>\n'+
                            '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">\n'+
                            '<!-- This is an automatically generated file.\n'+
                            'It will be read and overwritten.\n'+
                            'Do Not Edit! -->\n'+
                            '<TITLE>Bookmarks</TITLE>\n'+
                            '<H1>Bookmarks</H1>\n'+
                        '<DL><p>';
                        bookmarks=_.sortBy(bookmarks,function(bookmark){
                            return bookmark.weight;
                        });
                        _.each(bookmarks,function(bookmark){
                            tempItems=tempItems.concat(bookmark.items);
                            _.each(bookmark.items,function(itemData){
                                htmlStr+='\n<DT><A HREF="'+itemData.Url+'" ADD_DATE="'+moment(itemData.AddTime,'YYYY-MM-DD').unix()+'" PRIVATE="1" TAGS="'+itemData.itemTags+'">'+itemData.Title+'</A><DD>'+itemData.Desc;
                            });
                        });
                        fs.writeFileSync(bakPath+'/bookmarks-'+moment().format('YYYY-MM-DD')+'.json','{"bookmarks":'+JSON.stringify(tempItems)+'}',"utf8");
                        fs.writeFileSync(bakPath+'/bookmarks-'+moment().format('YYYY-MM-DD')+'.html',htmlStr+'</DL><p>',"utf8");
                        console.log('record end.');
                        process.exit();
                    }
                }
            };
        }(i))
    });
}
c.queue(configs);

