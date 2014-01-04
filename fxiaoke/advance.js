/**
 * User: q13
 * Date: 14-1-4
 * Time: 上午7:56
 */
var webPage=require('webpage');
var page = webPage.create();
var childWinIndex= 0,
    totalWinCounts=0;
page.customHeaders = {
    "User-Agent":"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:26.0) Gecko/20100101 Firefox/26.0 FirePHP/0.7.4"
};
page.onResourceRequested = function (request) {
    //console.log('Request ' + JSON.stringify(request, undefined, 4));
};
page.onResourceReceived = function (response) {
    //console.log('Receive ' + JSON.stringify(response, undefined, 4));
};
page.onResourceReceived = function (response) {
    //console.log('Receive ' + JSON.stringify(response, undefined, 4));
};
page.onConsoleMessage = function(msg, lineNum, sourceId) {
    //console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
};
page.onCallback = function(adLinks) {
    totalWinCounts=adLinks.length;
    page.render('temp/search.png');
    if(adLinks.length==0){
        phantom.exit();
    }
};
page.onPageCreated = function(newPage) {
    newPage.onResourceRequested = function (request) {
        console.log('Request ' + JSON.stringify(request, undefined, 4));
    };
    newPage.onLoadFinished = function(status) {
        console.log(JSON.stringify(newPage.cookies));
        //console.log(newPage.url);
        childWinIndex++;
        newPage.render('temp/page-'+childWinIndex+'.png');
        if(childWinIndex>=totalWinCounts){
            phantom.exit();
        }
    };
    // Decorate
    newPage.onClosing = function(closingPage) {
        console.log('A child page is closing: ' + closingPage.url);
    };
};
page.onLoadFinished = function(status) {
    //if ( status === "success"&&page.url!="http://www.baidu.com/") {
    if ( status === "success") {
        //page.switchToFocusedFrame();
        if(page.url.search('http://www.baidu.com/s')!=-1){
            page.evaluate(function() {
                var store=[],
                    linksEl=$('.EC_ppim_top .EC_title');
                linksEl.each(function(){
                    var meEl=$(this);
                    var meOffset= meEl.offset(),
                        meScrollTop=meEl.scrollTop(),
                        meScrollLeft=meEl.scrollLeft();
                    var evtMo;
                    evtMo = document.createEvent('MouseEvents');
                    evtMo.initMouseEvent("mouseover", true, true,window,1,meOffset.left-meScrollLeft,meOffset.top-meScrollTop,meOffset.left,meOffset.top,false,false,false,false,2,document.body); //模拟mouseover
                    this.dispatchEvent(evtMo);
                });
                setTimeout(function(){
                    linksEl.each(function(){
                        var meEl=$(this);
                        var meOffset= meEl.offset(),
                            meScrollTop=meEl.scrollTop(),
                            meScrollLeft=meEl.scrollLeft();
                        var evtMd,evtMu;
                        //定位偏移
                        meOffset.top=meOffset.top+5;
                        meOffset.left=meOffset.left+30;
                        evtMd = document.createEvent('MouseEvents');
                        evtMd.initMouseEvent("mousedown", true, true,window,1,meOffset.left-meScrollLeft,meOffset.top-meScrollTop,meOffset.left,meOffset.top,false,false,false,false,2,null); //模拟mousedown
                        evtMu = document.createEvent('MouseEvents');
                        evtMu.initMouseEvent("mouseup", true, true,window,1,meOffset.left-meScrollLeft,meOffset.top-meScrollTop,meOffset.left,meOffset.top,false,false,false,false,2,null); //模拟mouseup
                        this.dispatchEvent(evtMd);
                        this.dispatchEvent(evtMu);
                        window.open(this.href);
                        store.push(this.href);
                    });
                    this.callPhantom(store);
                },3000);
            });
        }

    }
};
//phantom.clearCookies();
page.open('http://www.baidu.com', function(status) {
    if ( status === "success" ) {
        page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js", function() {
            page.evaluate(function() {
                $('#kw').val('易动纷享');
                $('#su').click();
            });
            //phantom.exit();
        });
    }
});