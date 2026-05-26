"ui";

ui.layout(
    <vertical padding="16" bg="#ffffff">
        <text text="抖音自动化助手" textSize="22sp" textColor="#000000" marginBottom="16" gravity="center"/>
        
        <checkbox id="watchCB" text="观看视频" checked="true"/>
        <linear marginLeft="16" marginBottom="8">
            <text text="观看 " textColor="#666666"/>
            <input id="watchSec" w="60" text="3" inputType="number"/>
            <text text=" 秒" textColor="#666666"/>
        </linear>
        
        <checkbox id="followCB" text="关注" checked="true"/>
        <checkbox id="likeCB" text="点赞" checked="true"/>
        <checkbox id="collectCB" text="收藏" checked="true"/>
        <checkbox id="commentCB" text="评论" checked="true"/>
        
        <linear marginLeft="16" marginBottom="8">
            <text text="评论内容: " textColor="#666666"/>
            <input id="commentText" w="180" text="这个做的太棒了"/>
        </linear>
        
        <button id="startBtn" text="开始执行" marginTop="24" bg="#00C853" textColor="#ffffff"/>
        
        <text id="statusText" text="" textSize="14sp" marginTop="16" textColor="#666666" gravity="center"/>
    </vertical>
);

// 更新状态文本（在UI线程）
function updateStatus(text) {
    ui.run(function() {
        ui.statusText.setText(text);
    });
}

ui.startBtn.on("click", function() {
    var config = {
        watch: ui.watchCB.checked,
        watchSeconds: parseInt(ui.watchSec.text()) || 10,
        follow: ui.followCB.checked,
        like: ui.likeCB.checked,
        collect: ui.collectCB.checked,
        comment: ui.commentCB.checked,
        commentText: ui.commentText.text() || "这个做的太棒了"
    };
    
    updateStatus("正在启动抖音...");
    
    // 在子线程中执行自动化操作
    threads.start(function() {
        // 启动抖音
        launchApp("抖音");
        sleep(1000);
        
        // 上滑切换视频
        swipe(500, 1600, 500, 400, 500);
        sleep(1000);
        
        // 执行观看
        if (config.watch) {
            updateStatus("观看中... " + config.watchSeconds + "秒");
            sleep(config.watchSeconds * 1000);
        }
        
        // 执行关注
        if (config.follow) {
            updateStatus("执行关注...");
            var guanzhuBtn = descContains("关注").filter(function(b) {
                var bounds = b.bounds();
                return bounds.left >= 800 && bounds.top >= 900 && bounds.top <= 1300;
            }).findOne(2000);
            if (guanzhuBtn) {
                guanzhuBtn.click();
                sleep(3000);
            }
        }
        
        // 执行点赞
        if (config.like) {
            updateStatus("执行点赞...");
            var likeBtn = descContains("未点赞").filter(function(b) {
                var bounds = b.bounds();
                return bounds.left >= 800 && bounds.top >= 900 && bounds.top <= 1800;
            }).findOne(2000);
            if (likeBtn) {
                likeBtn.click();
                sleep(3000);
            }
        }
        
        // 执行收藏
        if (config.collect) {
            updateStatus("执行收藏...");
            var collectBtn = descContains("收藏").filter(function(b) {
                var bounds = b.bounds();
                return bounds.left >= 800 && bounds.top >= 900 && bounds.top <= 1800;
            }).findOne(2000);
            if (collectBtn) {
                collectBtn.click();
                sleep(3000);
            }
        }
        
        // 执行评论
        if (config.comment) {
            updateStatus("执行评论...");
            var commentBtn = descContains("评论").filter(function(b) {
                var bounds = b.bounds();
                return bounds.left >= 800 && bounds.top >= 900 && bounds.top <= 1800;
            }).findOne(2000);
            if (commentBtn) {
                commentBtn.click();
                sleep(2000);
                
                // 输入评论
                click(360, 2244);
                sleep(1500);

                var inputField = id("eq0").findOne(2000);
                if (inputField) {
                    inputField.setText(config.commentText);
                    sleep(1000);
                }

                // 点击发送
                var sendBtn = text("发送").filter(function(b) {
                    var bounds = b.bounds();
                    return bounds.top >= 600 && bounds.top <= 1200;
                }).findOne(3000);
                if (sendBtn) {
                    var sendBounds = sendBtn.bounds();
                    click((sendBounds.left + sendBounds.right) / 2, (sendBounds.top + sendBounds.bottom) / 2);
                    sleep(1000);
                }
                
                // 返回
                back();
                sleep(3000);
                back();
                sleep(3000);
            }
        }
        
        // 切换到下一个视频
        swipe(500, 1600, 500, 400, 500);
        updateStatus("执行完成！");
    });
});
