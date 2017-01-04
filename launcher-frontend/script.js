window.onload = checkJava;

function checkJava() {
    if (window.java === undefined) {
        setTimeout(checkJava, 100);
    } else {
        main();
    }
}

// data

var data = {
    initialized: false,
    localMinecraftPath: ""
}

// authorun

function main() {
    var appdata = java.getEnvironment("APPDATA");
    var localMinecraftPath = java.concatenatePaths(appdata, "cfactory2");

    data.initialized = true;
    data.localMinecraftPath = localMinecraftPath;
}

// core

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
            settings.iteration.call(self);
        }, 1);
    }
    self.onfinish = function() {

    }
}

var len_hashes = Object.keys(FILE_HASHES).length;
var incorrect_files = new pseudo_thread({
        iteration: function() {
            document.write("<br>Проверка файлов!");

            for(var fileName in FILE_HASHES) {
                this.process(fileName);
            }
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
                document.write("<br>Готово!");

                if (this.result.length > 0) {
                    java.print("Incorrect files: " + this.result);
                } else {
                    java.print("Empty");
                }
                return true;
            }
            return false;
        }
    });

var create_dir = new pseudo_thread({
        iteration: function() {
            var self = this;

            document.write("<br>Создание директорий!");

            DIR_LIST.forEach(function(entry) {
                self.process(entry);
            });
        },
        process: function(entry) {
            var fullFolderName = java.concatenatePaths(data.localMinecraftPath, entry);
            java.mkdirs(fullFolderName);
        },
        check_finish: function(processed_items) {
            if (processed_items.length == DIR_LIST.length) {
                document.write("<br>Готово!");

                java.print("Created dirs!");
                return true;
            }
            return false;
        }
    });

// events

function button_test(e) {
    if (!data.initialized) return;

    /*java.downloadFile(
        "http://localhost/icudtl.dat",
        java.concatenatePaths(data.localMinecraftPath, "icudtl.dat")
    );
    
    java.runProcess(data.localMinecraftPath + " ARGUMENTS FOR MINECRAFT");*/

    create_dir.onfinish = function() {
        incorrect_files.start();
    }
    create_dir.start();
}
