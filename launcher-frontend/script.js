

// Init

window.onload = checkJava;

function checkJava() {
    if (window.java === undefined) {
        setTimeout(checkJava, 100);
    } else {
        main();
    }
}

String.prototype.startsWith = function(needle)
{
    return (this.indexOf(needle) == 0);
};


// Data

var data = {
    initialized: false,
    localMinecraftPath: "",
    pathToClientDownload: window.location.origin + "/kph/client/",
    pathToAuthorizationScript: window.location.origin + "/kph/authorization.php?action="
}


// Authorun

function main() {
    var appdata = java.getEnvironment("APPDATA");
    var localMinecraftPath = java.concatenatePaths(appdata, "cfactory2");

    data.initialized = true;
    data.localMinecraftPath = localMinecraftPath;
}


// Core

function pseudo_thread(settings) {
    var self = this;
    self.result = [];
    self.processed = [];
    self.process = function(item) {
        setTimeout(function(item) {
            var res = settings.process.call(self, item);
            if (res !== undefined && res !== null) self.result.push(res);
            self.processed.push(item);
            if (settings.check_finish.call(self, self.processed)) {
                self.onfinish();
            }
        }, 1, item);
    }
    self.start = function() {
        setTimeout(function() {
            if (settings.iteration.call(self)) {
                if (settings.check_finish.call(self, self.processed)) {
                    self.onfinish();
                }
            }
        }, 1);
    }
    self.onfinish = function() {

    }
}

var len_hashes = Object.keys(FILE_HASHES).length;
var incorrect_files = new pseudo_thread({
        iteration: function() {
            print_info("Проверка файлов!");
            for(var fileName in FILE_HASHES) {
                this.process(fileName);
            }
            return false;
        },
        process: function(fileName) {
            var hash = FILE_HASHES[fileName]; 
            var fullFile = java.concatenatePaths(data.localMinecraftPath, fileName);
            var hashFile = java.calculateHash(fullFile);

            if (hashFile === null || (hash !== null && hashFile != hash)) {
                return fileName;
            }
        },
        check_finish: function(processed_items) {
            if (processed_items.length == len_hashes) {
                print_info("Готово!");
                return true;
            }
            return false;
        }
    });

var create_dir = new pseudo_thread({
        iteration: function() {
            var self = this;
            print_info("Создание директорий!");
            DIR_LIST.forEach(function(entry) {
                self.process(entry);
            });
            return false;
        },
        process: function(entry) {
            var fullFolderName = java.concatenatePaths(data.localMinecraftPath, entry);
            java.mkdirs(fullFolderName);
        },
        check_finish: function(processed_items) {
            if (processed_items.length == DIR_LIST.length) {
                print_info("Готово!");
                return true;
            }
            return false;
        }
    });

var downloading_files = [];
var download_client = new pseudo_thread({
        iteration: function() {
            var self = this;
            print_info("Загрузка файлов!");
            if (downloading_files.length > 0) {
                downloading_files.forEach(function(entry) {
                    self.process(entry);
                });
                return false;
            } else {
                return true;
            }
        },
        process: function(entry) {
            var origin = entry;

            while ((entry.length > 0) && (entry.startsWith("\\") || entry.startsWith("/"))) {
                entry = entry.substring(1);
            }
            if (entry.length == 0) return;

            var urlDownload = java.concatenateURL(data.pathToClientDownload, entry);
            var localFile = java.concatenatePaths(data.localMinecraftPath, entry);

            print_info("Загрузка файла: " + origin);
            java.downloadFile(urlDownload, localFile);
        },
        check_finish: function(processed_items) {
            if (processed_items.length == downloading_files.length) {
                print_info("Готово!");
                return true;
            }
            return false;
        }
    });


// Main part

var sectionAuth = document.getElementById("auth");
var sectionRun = document.getElementById("run");
var sectionRunContent = document.getElementById("run_content");
var inputUsername = document.getElementById("username");
var inputPassword = document.getElementById("password");

function print_info(msg) {
    var newNode = document.createElement('div');
    newNode.innerHTML = msg;
    sectionRunContent.appendChild(newNode);
    scroll_bottom();
}

function print_separate() {
    print_info("==========");
}

function scroll_bottom() {
    window.scrollTo(0, document.body.scrollHeight);
}

function make_request(url, username, password, callback) {
    var xhr = new XMLHttpRequest();
    var body = 'username=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password);

    xhr.open("POST", url, true)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            callback(this.responseText);
        }
    };
    xhr.send(body);
}

function run_play(user) {
    if (!data.initialized) return;

    print_separate();
    create_dir.onfinish = function() {
        print_separate();
        incorrect_files.onfinish = function() {
            print_separate();
            downloading_files = incorrect_files.result;
            download_client.onfinish = function() {
                var javaw_args = 'javaw -Duser.dir="%XXX%" -Djava.library.path="%XXX%\\versions\\OptiFine 1.10.2\\natives" -cp "%XXX%\\libraries\\com\\google\\code\\gson\\gson\\2.2.4\\gson-2.2.4.jar;%XXX%\\libraries\\com\\google\\guava\\guava\\17.0\\guava-17.0.jar;%XXX%\\libraries\\com\\ibm\\icu\\icu4j-core-mojang\\51.2\\icu4j-core-mojang-51.2.jar;%XXX%\\libraries\\com\\mojang\\authlib\\1.5.22\\authlib-1.5.22.jar;%XXX%\\libraries\\com\\mojang\\netty\\1.6\\netty-1.6.jar;%XXX%\\libraries\\com\\mojang\\realms\\1.9.8\\realms-1.9.8.jar;%XXX%\\libraries\\com\\paulscode\\codecjorbis\\20101023\\codecjorbis-20101023.jar;%XXX%\\libraries\\com\\paulscode\\codecwav\\20101023\\codecwav-20101023.jar;%XXX%\\libraries\\com\\paulscode\\libraryjavasound\\20101123\\libraryjavasound-20101123.jar;%XXX%\\libraries\\com\\paulscode\\librarylwjglopenal\\20100824\\librarylwjglopenal-20100824.jar;%XXX%\\libraries\\com\\paulscode\\soundsystem\\20120107\\soundsystem-20120107.jar;%XXX%\\libraries\\commons-codec\\commons-codec\\1.9\\commons-codec-1.9.jar;%XXX%\\libraries\\commons-io\\commons-io\\2.4\\commons-io-2.4.jar;%XXX%\\libraries\\commons-logging\\commons-logging\\1.1.3\\commons-logging-1.1.3.jar;%XXX%\\libraries\\io\\netty\\netty-all\\4.0.23.Final\\netty-all-4.0.23.Final.jar;%XXX%\\libraries\\it\\unimi\\dsi\\fastutil\\7.0.12_mojang\\fastutil-7.0.12_mojang.jar;%XXX%\\libraries\\net\\java\\dev\\jna\\jna\\3.4.0\\jna-3.4.0.jar;%XXX%\\libraries\\net\\java\\dev\\jna\\platform\\3.4.0\\platform-3.4.0.jar;%XXX%\\libraries\\net\\java\\jinput\\jinput\\2.0.5\\jinput-2.0.5.jar;%XXX%\\libraries\\net\\java\\jinput\\jinput-platform\\2.0.5\\jinput-platform-2.0.5-natives-windows.jar;%XXX%\\libraries\\net\\java\\jutils\\jutils\\1.0.0\\jutils-1.0.0.jar;%XXX%\\libraries\\net\\minecraft\\launchwrapper\\1.7\\launchwrapper-1.7.jar;%XXX%\\libraries\\net\\sf\\jopt-simple\\jopt-simple\\4.6\\jopt-simple-4.6.jar;%XXX%\\libraries\\optifine\\OptiFine\\1.10.2_HD_U_D4\\OptiFine-1.10.2_HD_U_D4.jar;%XXX%\\libraries\\org\\apache\\commons\\commons-compress\\1.8.1\\commons-compress-1.8.1.jar;%XXX%\\libraries\\org\\apache\\commons\\commons-lang3\\3.3.2\\commons-lang3-3.3.2.jar;%XXX%\\libraries\\org\\apache\\httpcomponents\\httpclient\\4.3.3\\httpclient-4.3.3.jar;%XXX%\\libraries\\org\\apache\\httpcomponents\\httpcore\\4.3.2\\httpcore-4.3.2.jar;%XXX%\\libraries\\org\\apache\\logging\\log4j\\log4j-api\\2.0-beta9\\log4j-api-2.0-beta9.jar;%XXX%\\libraries\\org\\apache\\logging\\log4j\\log4j-core\\2.0-beta9\\log4j-core-2.0-beta9.jar;%XXX%\\libraries\\org\\lwjgl\\lwjgl\\lwjgl\\2.9.4-nightly-20150209\\lwjgl-2.9.4-nightly-20150209.jar;%XXX%\\libraries\\org\\lwjgl\\lwjgl\\lwjgl-platform\\2.9.4-nightly-20150209\\lwjgl-platform-2.9.4-nightly-20150209-natives-windows.jar;%XXX%\\libraries\\org\\lwjgl\\lwjgl\\lwjgl_util\\2.9.4-nightly-20150209\\lwjgl_util-2.9.4-nightly-20150209.jar;%XXX%\\libraries\\oshi-project\\oshi-core\\1.1\\oshi-core-1.1.jar;%XXX%\\versions\\OptiFine 1.10.2\\OptiFine 1.10.2.jar" net.minecraft.client.main.Main --version 1.10 --gameDir "%XXX%" --assetsDir "%XXX%\\assets" --assetIndex 1.10 --userType mojang --tweakClass optifine.OptiFineTweaker ';
                javaw_args = javaw_args.replace(/%XXX%/g, data.localMinecraftPath);
                javaw_args += '--username ' + user["username"] + ' --uuid ' + user["uuid"] + ' --accessToken ' + user["accessToken"];
                java.runProcess(javaw_args);
                print_info("<br><br>Запуск Minecraft...");
                setTimeout(function() {
                    java.exit();
                }, 500);
            }
            download_client.start();
        }
        incorrect_files.start();
    }
    create_dir.start();
}

function show_auth() {
    sectionAuth.style.display = "block";
    sectionRun.style.display = "none";
}

function show_run() {
    sectionAuth.style.display = "none";
    sectionRun.style.display = "block";
}

function button_login(e) {
    var username = inputUsername.value;
    var password = inputPassword.value;

    make_request(
        data.pathToAuthorizationScript + "login",
        username, password,
        function(response) {
            var user = JSON.parse(response);
            if (user["success"]) {
                show_run();
                run_play(user);
            } else {
                java.error("Ошибка!", "Ошибка авторизации", user["errorMessage"]);
                show_auth();
            }
        });
}

function button_register(e) {
    var username = inputUsername.value;
    var password = inputPassword.value;

    make_request(
        data.pathToAuthorizationScript + "register",
        username, password,
        function(response) {
            var user = JSON.parse(response);
            if (user["success"]) {
                java.info("Готово", "Успешная регистрация", "Вы успешно зарегистрированы!");
            } else {
                java.error("Ошибка!", "Ошибка регистрации", user["errorMessage"]);
            }
        });
}
