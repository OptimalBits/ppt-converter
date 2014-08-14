using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Microsoft.Office.Core;
using PowerPoint = Microsoft.Office.Interop.PowerPoint;
using System.IO;

namespace pptconverter
{
    class Program
    {
        static int Main(string[] args)
        {
            string usage = "Usage: converter.exe <infile> <outfile> <png|jpg|video> <useTimings> <> <>";
            try {
                if(args.Length < 3) {
                    throw new ArgumentException("Wrong number of arguments.\n" + usage);
                }
                string sourceFile = Path.GetFullPath(args[0]);
                string destFile = Path.GetFullPath(args[1]);

                PowerPoint.Application pptApplication = new PowerPoint.Application();
                PowerPoint.Presentation pptPresentation = pptApplication.Presentations.Open(sourceFile, MsoTriState.msoFalse,
                MsoTriState.msoFalse, MsoTriState.msoFalse);
                
                switch (args[2]){
                    case "video" :
                        bool useTimings = true;
                        int slideTime = 5;
                        int verticalResolution = 480;
                        int framePerSecond = 10;
                        int quality = 70;
                        if(args.Length > 3) {
                            useTimings = Convert.ToBoolean(args[3]);
                            if(args.Length > 4) {
                                slideTime = Convert.ToInt16(args[4]);
                                if(args.Length > 5) {
                                    verticalResolution = Convert.ToInt16(args[5]);
                                    if(args.Length > 6) {
                                        framePerSecond = Convert.ToInt16(args[6]);
                                        if(args.Length > 7) {
                                            quality = Convert.ToInt16(args[7]);
                                        }
                                    }
                                }
                            }
                        }
                        pptPresentation.CreateVideo(destFile, useTimings, slideTime, verticalResolution, framePerSecond, quality);
                        do{
                            System.Threading.Thread.Sleep(500);
                            System.Console.WriteLine(pptPresentation.CreateVideoStatus);
                        } while (pptPresentation.CreateVideoStatus != PowerPoint.PpMediaTaskStatus.ppMediaTaskStatusDone);
                        System.Console.WriteLine("File converted to video");
                        break;
                    case "jpg" :
                    case "videofromjpg":
                        pptPresentation.Slides[1].Name = "moco";
                        pptPresentation.SaveAs(destFile, PowerPoint.PpSaveAsFileType.ppSaveAsJPG, MsoTriState.msoTrue);
                        System.Console.WriteLine("File converted to jpg");
                        break;
                    case "png" :
                    case "videofrompng":
                    default:
                        pptPresentation.SaveAs(destFile, PowerPoint.PpSaveAsFileType.ppSaveAsPNG, MsoTriState.msoTrue);
                        System.Console.WriteLine("File converted to png");
                        break;
                }
                pptApplication.Quit();
            }
            catch (Exception e) {
                System.Console.WriteLine("Error: " + e.Message);
                return 1;
            }
            return 0;
        }
    }
}
