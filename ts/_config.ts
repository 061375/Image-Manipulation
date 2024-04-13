export type Callback<T> = (data: any) => void;
export class Constants
{ 
      static readonly APP_VERSION         :string = "2.0.0.0";
      static readonly APP_NAME            :string = "Image Processor";
} 
export class Public {
    public static startTimer          :number = 0; 
    public static endTime             :number = 0;  
    public static now                 :number = 0;  
    public static CTX                 :Array<any> = [];
    public static CANVAS              :Array<any> = [];
    public static CIDS                :number = 0;
    public static WIDTH               :number = 0;
    public static HEIGHT              :number = 0;
    public static BUFFER              :any = null;
    public static IMGDATA             :any = null;
    public static ASCII_PIXELS        :Array<string> = [];
}