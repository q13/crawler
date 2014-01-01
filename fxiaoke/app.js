/**
 * User: q13
 * Date: 14-1-1
 * Time: 上午9:39
 */
var webPage=require('webpage');
var page = webPage.create();
page.open('http://www.baidu.com/s?wd=%E7%BA%B7%E4%BA%AB%E9%94%80%E5%AE%A2&rsv_spt=1&issp=1&rsv_bp=0&ie=utf-8&tn=baiduhome_pg&rsv_sug3=6&rsv_sug1=4&rsv_sug4=615&oq=&rsp=0&f=3&rsv_sug5=0', function(status) {
    if ( status === "success" ) {
        page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js", function() {
            var adLinks,
                tempRecordIndex,
                tempPageHeader= {
                    'X-Test': '13',
                    'DNT': '1'
                };
            adLinks=page.evaluate(function() {
                var store=[];
                var evt = document.createEvent('HTMLEvents');
                evt.initEvent("mousedown", true, true); //模拟点击
                $('.EC_ppim_top .EC_title').each(function(){
                    this.dispatchEvent(evt);
                    store.push(this.href);
                });
                return JSON.stringify(store);
                //console.log($('#aw1').attr('href'));
            });
            adLinks=JSON.parse(adLinks);
            tempRecordIndex=0;
            adLinks.forEach(function(link){
                var tempPage = webPage.create();
                tempPage.customHeaders=tempPageHeader;
                tempPage.open(link,function(){
                    tempRecordIndex++;
                    console.log(link);
                    tempPage.release();
                    if(tempRecordIndex==adLinks.length){
                        phantom.exit();
                    }
                });
            });
            //console.log(JSON.parse(adLinks));

            //phantom.exit();
        });
    }
});
