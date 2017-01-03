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

// events

function create_dirs() {
    DIR_LIST.forEach(function(entry) {
        var fullFolderName = java.concatenatePaths(data.localMinecraftPath, entry);
        java.mkdirs(fullFolderName);
    });
}

function get_incorrect_files() {
    var incorrectFiles = [];

    for(var fileName in FILE_HASHES) { 
        var hash = FILE_HASHES[fileName]; 
        var fullFile = java.concatenatePaths(data.localMinecraftPath, fileName);
        var hashFile = java.calculateHash(fullFile);

        if (hashFile === null || hashFile != hash) {
            incorrectFiles.push(fileName);
        }
    }

    return incorrectFiles;
}

function button_test(e) {
    if (!data.initialized) return;
    /*java.downloadFile(
        "http://localhost/icudtl.dat",
        java.concatenatePaths(data.localMinecraftPath, "icudtl.dat")
    );
    java.runProcess(data.localMinecraftPath + " ARGUMENTS FOR MINECRAFT");*/
    
    //create_dirs();

    java.print("[" + get_incorrect_files() + "]");
}
