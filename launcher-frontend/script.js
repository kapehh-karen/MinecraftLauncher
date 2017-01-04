

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

            if (hashFile === null || hashFile != hash) {
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

function run_play() {
    if (!data.initialized) return;

    print_separate();
    create_dir.onfinish = function() {
        print_separate();
        incorrect_files.onfinish = function() {
            print_separate();
            downloading_files = incorrect_files.result;
            download_client.onfinish = function() {
                print_info("RUN MINECRAFT!");
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
    show_run();

    //run_play();
    var username = inputUsername.value;
    var password = inputPassword.value;

    make_request(
        data.pathToAuthorizationScript + "login",
        username, password,
        function(response) {
            var data = JSON.parse(response);
            if (data["success"]) {
                java.print(response);
            } else {
                java.error("Ошибка!", "Ошибка авторизации", data["errorMessage"]);
                show_auth();
            }
        });
}
