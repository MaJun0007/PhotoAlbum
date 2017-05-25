/**
 * Created by MJ on 2017/5/2.
 */
(function(){
    var hasLoadImg= 0,
        showLoadImgs=12,
        loadedImgs=0;
    var pics=document.querySelector(".pics");
    var lis=pics.getElementsByTagName("li");
    var wrap=document.querySelector(".wrap");
    var child=wrap.children[0];
    var minTop=wrap.getBoundingClientRect().top+wrap.getBoundingClientRect().height;
    var isAllLoaded=false;
    createLi();
    cssTransform(child,"translateZ",0.1);
    function createLi(){
        if(!isAllLoaded&&hasLoadImg>=dataUrl.length){
            loadMore.innerHTML="到底了！";
            setTimeout(function (){
                child.style.transition="0.5s";
                cssTransform(child,"translateY",maxTop);
                loadMore.style.opacity=0;
                isAllLoaded=true;
            },2000);
            return;
        }
        loadedImgs=hasLoadImg+showLoadImgs;
        loadedImgs=loadedImgs>=dataUrl.length?dataUrl.length:loadedImgs;
        for(var i=hasLoadImg,len=loadedImgs; i<len; i++){
            var $li=document.createElement('li');
            $li.src=dataUrl[i];
            $li.hasLoad=false;
            pics.appendChild($li);
        }
        showImg();
    }
    function showImg(){
        for(var i=0,len=lis.length; i<len; i++){
            var liTop=lis[i].getBoundingClientRect().top;
            if(!isAllLoaded&&!lis[i].hasLoad&&liTop<minTop){
                createImg(lis[i]);
                lis[i].hasLoad=true;
            }
        }

    }
    function createImg(li){
        var img=new Image();
        img.src=li.src;
        img.onload=function (){
            var canvas=document.createElement("canvas");
            var ctx=canvas.getContext("2d");
            canvas.height=img.height;
            canvas.width=img.width;
            ctx.drawImage(img,0,0,canvas.width,canvas.height);
            li.appendChild(canvas);
            setTimeout(function (){
                canvas.style.opacity=1;
            },200);
        }
    }
    var wrapHeight=wrap.clientHeight;
    var childHeight=child.offsetHeight;
    var loadMore=wrap.querySelector(".loadMore");
    var maxTop=wrapHeight-childHeight;
    var liIsBottom=false;
    var canLoadMore=false;
    var barScale=wrapHeight/childHeight;
    var bar=wrap.querySelector(".bar");
    cssTransform(bar,"translateZ",0.1);
    var callBack={
        moveStart:function (){
            child.style.transition="none";
            var childStartPoint=cssTransform(child,"translateY");
            childHeight=child.offsetHeight;
            maxTop=wrapHeight-childHeight;
            barScale=wrapHeight/childHeight;
            bar.style.height=barScale*wrapHeight+"px";
            bar.style.opacity=1;
            cssTransform(bar,"translateY",childStartPoint*barScale);
            if(childStartPoint<=maxTop){
                liIsBottom=true;
            }
        },
        moving:function (){
            var childNowPoint=cssTransform(child,"translateY");
            cssTransform(bar,"translateY",-childNowPoint*barScale);
            showImg();
            if(!isAllLoaded&&liIsBottom){
                var over=maxTop-childNowPoint;
                var loadMoreScale=over/loadMore.offsetHeight;
                loadMoreScale=loadMoreScale<0?0:
                              loadMoreScale>1?1:loadMoreScale;
                cssTransform(loadMore,"scale",loadMoreScale);
                loadMore.style.opacity=loadMoreScale;
                if(loadMoreScale>=1){
                    canLoadMore=true;
                }
            }
        },
        moveEnd:function (){
            if(!isAllLoaded&&liIsBottom&&canLoadMore){
                clearInterval(child.scroll);
                hasLoadImg=loadedImgs;
                createLi();
                canLoadMore=false;
                cssTransform(loadMore,"scale",0);
                loadMore.style.opacity=0;
            }
            bar.style.opacity=0;
        }
    }
    mscroll(wrap,callBack)
})();
