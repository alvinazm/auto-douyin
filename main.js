"ui";

ui.layout(
    <vertical padding="16" bg="#ffffff">
        <text text="抖音自动化助手" textSize="22sp" textColor="#000000" marginBottom="16" gravity="center"/>

        <linear marginLeft="16" marginBottom="8">
            <text text="自动操作总时长" />
            <input id="totalMin" w="40" text="1" inputType="number"/>
            <text text=" 分钟" />
        </linear>

        <checkbox id="watchCB" text="观看视频" checked="true"/>
        <linear marginLeft="16">
            <text text="单视频随机观看 " textColor="#666666"/>
            <input id="watchMin" w="40" text="2" inputType="number"/>
            <text text=" - " textColor="#666666"/>
            <input id="watchMax" w="40" text="5" inputType="number"/>
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

function updateStatus(text) {
    ui.run(function() {
        ui.statusText.setText(text);
    });
}

ui.startBtn.on("click", function() {
    var config = {
        watch: ui.watchCB.checked,
        watchMin: parseInt(ui.watchMin.text()) || 2,
        watchMax: parseInt(ui.watchMax.text()) || 5,
        follow: ui.followCB.checked,
        like: ui.likeCB.checked,
        collect: ui.collectCB.checked,
        comment: ui.commentCB.checked,
        commentText: ui.commentText.text() || "这个做的太棒了",
        totalMinutes: parseInt(ui.totalMin.text()) || 1
    };

    console.log("===========================================");
    console.log("DEBUG: 用户设置的总时长: " + config.totalMinutes + " 分钟");
    console.log("DEBUG: 观看秒数范围: " + config.watchMin + " - " + config.watchMax + " 秒");
    console.log("DEBUG: 关注: " + config.follow + ", 点赞: " + config.like + ", 收藏: " + config.collect + ", 评论: " + config.comment);
    console.log("DEBUG: 评论内容: " + config.commentText);
    console.log("===========================================");

    updateStatus("正在启动抖音...");

    threads.start(function() {
        var startTime = java.lang.System.currentTimeMillis();
        var endTime = startTime + (config.totalMinutes * 60 * 1000);
        var videoCount = 0;
        var shouldLoop = config.totalMinutes >= 1;

        console.log("DEBUG: 线程开始时间: " + startTime);
        console.log("DEBUG: 计划结束时间: " + endTime);
        console.log("DEBUG: 计划运行时长: " + (config.totalMinutes * 60 * 1000) + " 毫秒");
        console.log("DEBUG: shouldLoop = " + shouldLoop);

        launchApp("抖音");
        sleep(1000);

        var videoCount = 0;
        var startTime = java.lang.System.currentTimeMillis();
        var endTime = startTime + (config.totalMinutes * 60 * 1000);
        var shouldLoop = config.totalMinutes >= 1;

        // Process at least one video, then continue looping if enabled and time remains
        while (true) {
            var currentTime = java.lang.System.currentTimeMillis();
            var remainingMs = endTime - currentTime;

            // 在开始下一个视频前检查剩余时间
            if (videoCount > 0 && remainingMs <= 0) {
                console.log("DEBUG: 时间到，停止循环，剩余时间: " + remainingMs + "ms");
                break;
            }

            videoCount++;
            var remainingMin = Math.ceil(remainingMs / 60000);
            if (remainingMin < 0) remainingMin = 0;
            updateStatus("视频 " + videoCount + " | 剩余 " + remainingMin + " 分钟");

            // Swipe to next video
            swipe(500, 1600, 500, 400, 500);
            sleep(1000);

            // Execute watch
            if (config.watch) {
                var watchSec = random(config.watchMin, config.watchMax);
                updateStatus("观看 " + watchSec + " 秒...");
                sleep(watchSec * 1000);
            }

            // Execute follow
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

            // Execute like
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

            // Execute collect
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

            // Execute comment
            if (config.comment) {
                updateStatus("执行评论...");
                console.log("DEBUG: Looking for comment button");
                var commentBtn = descContains("评论").filter(function(b) {
                    var bounds = b.bounds();
                    return bounds.left >= 800 && bounds.top >= 900 && bounds.top <= 1800;
                }).findOne(2000);
                console.log("DEBUG: commentBtn found:", !!commentBtn);
                if (commentBtn) {
                    commentBtn.click();
                    console.log("DEBUG: Clicked comment button");
                    sleep(2000);

                    // Click input field to focus
                    console.log("DEBUG: Clicking input field at 360, 2244");
                    click(360, 2244);
                    sleep(1500);

                    // Clear input using setText approach
                    console.log("DEBUG: Finding input field");
                    var inputField = id("eq0").findOne(2000);
                    console.log("DEBUG: inputField found:", !!inputField);
                    if (inputField) {
                        inputField.setText("");
                        sleep(300);
                        inputField.setText(config.commentText);
                        sleep(1000);
                    }

                    // Click send button
                    console.log("DEBUG: Looking for send button");
                    var sendBtn = text("发送").filter(function(b) {
                        var bounds = b.bounds();
                        return bounds.top >= 600 && bounds.top <= 1200;
                    }).findOne(3000);
                    console.log("DEBUG: sendBtn found:", !!sendBtn);

                    if (sendBtn) {
                        var sendBounds = sendBtn.bounds();
                        click((sendBounds.left + sendBounds.right) / 2, (sendBounds.top + sendBounds.bottom) / 2);
                        console.log("DEBUG: Clicked send button");
                        sleep(1500);
                    }

                    // Press back twice to return to video
                    console.log("DEBUG: Pressing back");
                    back();
                    sleep(500);
                    back();
                    sleep(500);
                }
            }

            console.log("DEBUG: ===========================================");
            console.log("DEBUG: 开始处理视频 #" + videoCount);
            console.log("DEBUG: 当前时间: " + currentTime);
            console.log("DEBUG: 剩余时间: " + remainingMs + "ms (" + (remainingMs/1000).toFixed(1) + "秒)");
            console.log("DEBUG: ===========================================");

            // Check if should continue looping
            if (!shouldLoop) {
                // Single pass mode - only process one video
                console.log("DEBUG: Single pass mode, breaking");
                break;
            } else {
                // Loop mode - continue if time remains
                console.log("DEBUG: Loop mode, time remaining: " + (endTime - java.lang.System.currentTimeMillis()) + "ms");
                if (java.lang.System.currentTimeMillis() >= endTime) {
                    console.log("DEBUG: Time expired, breaking");
                    break;
                }
                console.log("DEBUG: Continuing loop, will swipe next");
            }
        }

        console.log("DEBUG: Loop ended, total videos: " + videoCount);
        updateStatus("执行完成！共处理 " + videoCount + " 个视频");
    });
});