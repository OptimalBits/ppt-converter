ppt-converter
=============

#Requirements:
- Node 0.8.x or higher
- Microsoft Office 2013
- .NET 4
- avconv (libav.org)
- npm install forever -g

#Install
- You will need to add the windows machine to github deployment keys. Check github for instructions.
- Clone this repository.
- Copy avconv bin folder under directory avconv in the project root folder.
- Execute run.bat

#Automatic restarts
In order to automatically install all windows updates, a daily restart is recommended:

1.   Launch Task Scheduler.
2.   Click Action and select Create Basic task.
3.   Type AutoRestart (or others you want) in the Name box and click Next.
4.   Select Daily and click Next
5.   Type the time you want to restart the computer and click Next.
6.   Select Start a program and click Next.
7.   Click Browser and navigate to pptconverter, select restart.bat and click Next.
8.   Click Finish.
