The language used is Rust.

Download and Installation:

    It can be downloaded and then installed from here: https://www.rust-lang.org/en-US/install.html

    The following snippet from the above site describes some additional things needed to do to install
    Rust on Windows:
        On Windows, Rust additionally requires the C++ build tools for Visual Studio 2013 or later.
        The easiest way to acquire the build tools is by installing Microsoft Visual C++ Build Tools 2017
        (link: [https://www.visualstudio.com/downloads/#build-tools-for-visual-studio-2017])
        which provides just the Visual C++ build tools.
        Alternately, you can install Visual Studio 2017,
        Visual Studio 2015, or Visual Studio 2013 and during install select the "C++ tools".

    I already had the C++ Tools installed on my Windows PC. I simply followed the prompts
    in the Windows installer from the above site in order to install.

IDE:
    There is no offical/standard Rust IDE. There are simply plugins for whichever IDE you prefer.
    See: https://forge.rust-lang.org/ides.html

    You may also use your favorite text editor, which is what I did. 

    I used VIM.

Compilation:
    My Rust project uses Rust's cargo build system which is similar to make.

    If Rust is installed, per the above link, then cargo should also be installed.

    In order to compile/build the code simply navigate to this directory /{mySvnDir}/Project2/project2
    and then execute the command "cargo build".

    This will ONLY build the project it will not run it.

Execution:
    The main way that cargo projects are executed is by navigating to the project directory (see above)
    and then executing the command "cargo run".

    However, you can also execute the program by navingating the the directory and then executing the command
    "./target/debug/project2.exe" on Windows
    or "./target/debug/project2" on *nix (untested, as I only have a Windows machine)
