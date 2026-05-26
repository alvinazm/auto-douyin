"ui";

ui.layout(
    <scroll>
        <vertical padding="16" bg="#f5f5f5">
            <text text="抖音自动化助手" textSize="24sp" textColor="#212121" marginBottom="24" gravity="center"/>

        <card marginBottom="16" cardCornerRadius="12" cardElevation="2" bg="#ffffff">
            <vertical padding="16">
                <text text="全局设置" textSize="14sp" textColor="#757575" marginBottom="12"/>

                <text text="执行模式" textSize="14sp" textColor="#424242" marginBottom="8"/>
                <linear gravity="center_vertical">
                    <radiogroup id="modeRG" orientation="vertical">
                        <radio id="randomMode" text="随机模式" checked="true"/>
                        <radio id="fullMode" text="全套模式" marginTop="8"/>
                    </radiogroup>
                    <vertical>
                        <text id="hintRandom" text="ⓘ" textSize="14sp" textColor="#9e9e9e"/>
                        <text id="hintFull" text="ⓘ" textSize="14sp" textColor="#9e9e9e" marginTop="24"/>
                    </vertical>
                </linear>

                <linear gravity="center_vertical">
                    <text text="自动操作总时长" textSize="14sp" textColor="#424242"/>
                    <input id="totalMin" w="50" text="1" inputType="number" marginLeft="8" bg="#f5f5f5" padding="8"/>
                    <text text="分钟" textSize="14sp" textColor="#424242" marginLeft="8"/>
                </linear>
            </vertical>
        </card>

        <card marginBottom="16" cardCornerRadius="12" cardElevation="2" bg="#ffffff">
            <vertical padding="16">
                <text text="视频操作" textSize="14sp" textColor="#757575" marginBottom="12"/>

                <checkbox id="watchCB" text="观看视频" textSize="14sp" textColor="#424242" checked="true" marginBottom="12"/>

                <linear gravity="center_vertical" marginLeft="24" marginBottom="16">
                    <text text="观看时长 " textSize="13sp" textColor="#616161"/>
                    <input id="watchMin" w="40" text="2" inputType="number" bg="#f5f5f5" padding="6"/>
                    <text text=" - " textSize="13sp" textColor="#616161"/>
                    <input id="watchMax" w="40" text="5" inputType="number" bg="#f5f5f5" padding="6"/>
                    <text text=" 秒" textSize="13sp" textColor="#616161"/>
                </linear>

                <View bg="#e0e0e0" h="1" marginBottom="12"/>

                <checkbox id="followCB" text="关注" textSize="14sp" textColor="#424242" checked="true" marginBottom="8"/>
                <checkbox id="likeCB" text="点赞" textSize="14sp" textColor="#424242" checked="true" marginBottom="8"/>
                <checkbox id="collectCB" text="收藏" textSize="14sp" textColor="#424242" checked="true" marginBottom="8"/>
                <checkbox id="commentCB" text="评论" textSize="14sp" textColor="#424242" checked="true" marginBottom="12"/>

                <linear gravity="center_vertical" marginLeft="24">
                    <text text="评论内容 " textSize="13sp" textColor="#616161"/>
                    <input id="commentText" w="160" text="这个做的太棒了" bg="#f5f5f5" padding="8"/>
                </linear>
            </vertical>
        </card>

        <button id="startBtn" text="开始执行" textSize="16sp" marginTop="8" marginBottom="16" bg="#00c853" textColor="#ffffff" gravity="center" h="48"/>

        <text id="statusText" text="" textSize="13sp" textColor="#757575" gravity="center"/>
        </vertical>
    </scroll>
);

function updateStatus(text) {
    ui.run(function() {
        ui.statusText.setText(text);
    });
}

ui.hintRandom.on("click", function() {
    dialogs.alert("随机模式", "每个视频随机选择几个你勾选的操作执行", function() {});
});

ui.hintFull.on("click", function() {
    dialogs.alert("全套模式", "每个视频会执行你勾选的全部操作", function() {});
});

ui.startBtn.on("click", function() {
    var config = {
        mode: ui.randomMode.checked ? "random" : "full",
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
    console.log("DEBUG: 执行模式: " + config.mode);
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
            // 根据模式确定要执行的动作
            var actionsToExecute = [];
            if (config.watch) actionsToExecute.push("watch");
            if (config.follow) actionsToExecute.push("follow");
            if (config.like) actionsToExecute.push("like");
            if (config.collect) actionsToExecute.push("collect");
            if (config.comment) actionsToExecute.push("comment");

            // 随机模式下随机选择部分动作
            if (config.mode === "random" && actionsToExecute.length > 0) {
                var shuffled = actionsToExecute.slice();
                for (var i = shuffled.length - 1; i > 0; i--) {
                    var j = Math.floor(Math.random() * (i + 1));
                    var temp = shuffled[i]; shuffled[i] = shuffled[j]; shuffled[j] = temp;
                }
                var count = random(1, actionsToExecute.length);
                actionsToExecute = shuffled.slice(0, count);
                console.log("DEBUG: 随机模式，本次执行动作: " + actionsToExecute.join(", "));
            } else {
                console.log("DEBUG: 全套模式，执行所有动作: " + actionsToExecute.join(", "));
            }

            // 执行观看的动作（根据随机/全套模式）
            if (actionsToExecute.indexOf("watch") !== -1) {
                var watchSec = random(config.watchMin, config.watchMax);
                updateStatus("观看 " + watchSec + " 秒...");
                sleep(watchSec * 1000);
            }

            // Execute follow
            if (actionsToExecute.indexOf("follow") !== -1) {
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
            if (actionsToExecute.indexOf("like") !== -1) {
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
            if (actionsToExecute.indexOf("collect") !== -1) {
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
            if (actionsToExecute.indexOf("comment") !== -1) {
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