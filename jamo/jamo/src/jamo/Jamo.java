
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package jamo;

import com.mongodb.MongoClient;
import com.mongodb.MongoException;
import com.mongodb.WriteConcern;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.DBCursor;
import com.mongodb.ServerAddress;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.net.UnknownHostException;
import java.util.Arrays;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


/**
 *
 * @author m
 */
public class Jamo {
	public static void test(String importfile) throws IOException {
		BufferedReader br = null;
		
		String sCurrentLine;
		
		String weatherfilepath = new java.io.File( importfile ).getCanonicalPath();
        System.out.println("Trying to open file: " + weatherfilepath);
        
		
		br = new BufferedReader(new FileReader(weatherfilepath));

		while ((sCurrentLine = br.readLine()) != null) {
			System.out.println(sCurrentLine);
			System.out.println(" ID:" + sCurrentLine.substring(1, 6).trim());
			
		}
		
		
	}
//headrecordsger(importfile, mongoip, mongoport, mongodb, mongocoll, mongouser, mongopass );
            
	public static void importall(String importfile, String mongoip, String mongoport, String mongodb, String mongocoll, String mongouser, String mongopass, int year) throws IOException {
            char escCode = 0x1B;
        
            String collname = "headrecords";
		String dbuser = "infosys";
		String dbpass = "InfoKirsten321";
		MongoClient mongoClient;
		mongoClient = new MongoClient( mongoip+":"+mongoport );
		DB db = mongoClient.getDB( mongodb );
		System.out.println("Try to connect:" + db.authenticate(mongouser, mongopass.toCharArray()));
		
		//alte collection verwerfen
		DBCollection coll = db.getCollection(mongocoll);
		coll.drop();
		
		//zaehlvariable fuer wartebildschirm
		int n = 0;
		
		String weatherfilepath = new java.io.File( importfile ).getCanonicalPath();
        System.out.println("Trying to open file: " + weatherfilepath);
        
        BufferedReader br = null;
        
        //Pattern pattern = Pattern.compile("^[0-9]{6}[ A-Z,0-9]{8}(?!SHIP)+.*");
        
        
		
			String sCurrentLine = "";
                        String sLastWeatherId = "";
			String sLastWeatherIdYear = "";
			long yearsIgnored = 0;
                        br = new BufferedReader(new FileReader(weatherfilepath));
 
                        System.out.println("Beginning import files - please standby ...");
                        
			while ((sCurrentLine = br.readLine()) != null) {
                                if(sCurrentLine.charAt(0) == '#') {      //headline ??
                                    //Matcher matcher = pattern.matcher(sCurrentLine); 
                                    //if(matcher.matches()) {	
                                    //System.out.println(sCurrentLine);
                                    ////wait function 
                                    //if(++n < 160 )System.out.print('.');
                                    //else {n=0; System.out.println(".");}
                                    ////


                                    //if(++n%2 == 0) System.out.print("-");
                                    //else System.out.print("|");
                                    //System.out.print('\b');


                                    if(++n%10000 == 0) System.out.print(n + " ..... ");


                                        String WETTERID  = sCurrentLine.substring(1, 6);   //   2-  6
                                        String YEAR  = sCurrentLine.substring(6, 10);      //   7- 10
                                        String MONTH  = sCurrentLine.substring(10, 12);     //  11- 12
                                        String DAY  = sCurrentLine.substring(12, 14);       //  13- 14
                                        String HOUR  = sCurrentLine.substring(14, 16);      //  15- 16
                                        String RELTIME  = sCurrentLine.substring(16, 20);   //  17- 20
                                        String NUMLEV  = sCurrentLine.substring(20, 24);    //  21- 24
                                        String PW  = sCurrentLine.substring(24, 30);        //  25- 30
                                        String INVPRESS  = sCurrentLine.substring(30, 36);  //  31- 36
                                        String INVHGT  = sCurrentLine.substring(36, 42);    //  37- 42
                                        String INVTEMPDIF  = sCurrentLine.substring(42, 48);//  43- 48
                                        String MIXPRESS  = sCurrentLine.substring(48, 54);  //  49- 54
                                        String MIXHGT  = sCurrentLine.substring(54, 60);    //  55- 60
                                        String FRZPRESS  = sCurrentLine.substring(60, 66);  //  61- 66
                                        String FRZHGT  = sCurrentLine.substring(66, 72);    //  67- 72
                                        String LCLPRESS  = sCurrentLine.substring(72, 78);  //  73- 78
                                        String LCLHGT  = sCurrentLine.substring(78, 84);    //  79- 84
                                        String LFCPRESS  = sCurrentLine.substring(84, 90);  //  85- 90
                                        String LFCHGT  = sCurrentLine.substring(90, 96);    //  91- 96
                                        String LNBPRESS  = sCurrentLine.substring(96, 102);  //  97-102
                                        String LNBHGT  = sCurrentLine.substring(102, 108);    // 103-108
                                        String LI  = sCurrentLine.substring(106, 114);        // 109-114
                                        String SI  = sCurrentLine.substring(114, 120);        // 115-120
                                        String KI   = sCurrentLine.substring(120, 126);       // 121-126
                                        String TTI = sCurrentLine.substring(126, 132);        // 127-132
                                        String CAPE  = sCurrentLine.substring(132, 138);      // 133-138
                                        String CIN  = sCurrentLine.substring(138, 144);       // 139-144
                                        String TEMP     = "-9999";
                                        String PRESS = "-9999";

                                        sLastWeatherId = WETTERID + YEAR + MONTH + DAY + HOUR + RELTIME;
                                        sLastWeatherIdYear = YEAR;

                                        if(Integer.parseInt(sLastWeatherIdYear) >= year) {


                                        BasicDBObject doc = new BasicDBObject("wetterid", WETTERID).
                                                        append("year", YEAR).
                                                        append("month", MONTH).
                                                        append("day", DAY).
                                                        append("hour", HOUR).
                                                        append("reltime", RELTIME).
                                                        append("numlev", NUMLEV).
                                                        append("pw", PW).
                                                        append("invpress", INVPRESS).
                                                        append("invhgt", INVHGT).
                                                        append("invtempdif", INVTEMPDIF).
                                                        append("mixpress", MIXPRESS).
                                                        append("mixhgt", MIXHGT).
                                                        append("frzpress", FRZPRESS).
                                                        append("frzhgt", FRZHGT).
                                                        append("lclpress", LCLPRESS).
                                                        append("lclhgt", LCLHGT).
                                                        append("lfcpress", LFCPRESS).
                                                        append("lfchgt", LFCHGT).
                                                        append("lnbpress", LNBPRESS).
                                                        append("lnbhgt", LNBHGT).
                                                        append("li", LI).
                                                        append("si", SI).
                                                        append("ki", KI).
                                                        append("tti", TTI).
                                                        append("cape", CAPE).
                                                        append("cin", CIN).
                                                        append("temp", TEMP).
                                                        append("press", PRESS);

                                        coll.insert(doc);
                                    } else yearsIgnored++;
				} else {    // keine headline
                                    
                                    if(Integer.parseInt(sLastWeatherIdYear) >= year) {
                                    
                                        if(++n%10000 == 0) System.out.print(n + " ..... ");

                                        String PRESS        = sCurrentLine.substring(0, 7);
                                        String OBSGPH       = sCurrentLine.substring(9, 15);
                                        String CALCGPH      = sCurrentLine.substring(16, 23);
                                        String TEMP         = sCurrentLine.substring(24, 31);
                                        String TEMPGRAD     = sCurrentLine.substring(32, 39);
                                        String PTEMP        = sCurrentLine.substring(40, 47);
                                        String PTEMPGRAD    = sCurrentLine.substring(48, 55);
                                        String VTEMP        = sCurrentLine.substring(56, 63);
                                        String VTEMPGRAD    = sCurrentLine.substring(64, 71);
                                        String VAPPRESS     = sCurrentLine.substring(72, 79);
                                        String SATVAP       = sCurrentLine.substring(80, 87);
                                        String RH           = sCurrentLine.substring(88, 95);
                                        String RHGRAD       = sCurrentLine.substring(96, 103);
                                        String UWND         = sCurrentLine.substring(104, 111);
                                        String UWDGRAD      = sCurrentLine.substring(112, 119);
                                        String VWND         = sCurrentLine.substring(120, 127);
                                        String VWNDGRAD     = sCurrentLine.substring(128, 135);
                                        String N            = sCurrentLine.substring(136, 143);

                                        BasicDBObject doc = new BasicDBObject("HEADRECORDID", sLastWeatherId).
                                             append("press",    PRESS).
                                             append("obsgph",   OBSGPH).
                                             append("calcgph",  CALCGPH).
                                             append("temp",     TEMP).
                                             append("tempgrad", TEMPGRAD).
                                             append("ptemp",    PTEMP).
                                             append("ptempgrad", PTEMPGRAD).
                                             append("vtemp",    VTEMP).
                                             append("vtempgrad", VTEMPGRAD).
                                             append("vappress",    VAPPRESS).
                                             append("satvap", SATVAP).
                                             append("rh", RH).
                                             append("rhgrad", RHGRAD).
                                             append("uwnd", UWND).
                                             append("uwdgrad", UWDGRAD).
                                             append("vwnd", VWND).
                                             append("vwndgrad", VWNDGRAD).
                                             append("n", N);

                                     coll.insert(doc);
                                } else yearsIgnored++;
                            }
			}
 
		
		
		
		DBCursor cursor = coll.find();
		
                System.out.println("\n\nDie ersten (max.) 10 Datensätze: ");
                int m = 0;
               
                while(cursor.hasNext()) {
                   System.out.println(cursor.next());
                   if(++m >= 10) break;

               }
               cursor.close();
		
		System.out.println("Collection " + mongocoll + " in Datenbank " + mongodb + " enthaelt nun " + coll.count() + " Datensaetze.");
		System.out.println("zu alte Datensaetze ignoriert (Parameter -y): " + yearsIgnored);
	
	
	
	}
	
        ////
        
        public static void importhr(String importfile, String mongoip, String mongoport, String mongodb, String mongocoll, String mongouser, String mongopass, int year) throws IOException {
            char escCode = 0x1B;
        
            MongoClient mongoClient;
            mongoClient = new MongoClient( mongoip+":"+mongoport );
            DB db = mongoClient.getDB( mongodb );
            System.out.println("Try to connect:" + db.authenticate(mongouser, mongopass.toCharArray()));
		
            //alte collection verwerfen
            DBCollection coll = db.getCollection(mongocoll);
            coll.drop();
		
            //zaehlvariable fuer wartebildschirm
            int n = 0;
		
            String weatherfilepath = new java.io.File( importfile ).getCanonicalPath();
            System.out.println("Trying to open file: " + weatherfilepath);
        
            BufferedReader br = null;
            //Pattern pattern = Pattern.compile("^[0-9]{6}[ A-Z,0-9]{8}(?!SHIP)+.*");
        
        
            int presssum = 0, presscount = 1;
            int tempsum = 0, tempcount = 1;
            String sCurrentLine = "";
            String sLastWeatherId = "";
            String sLastWeatherIdYear = "";
            long yearsIgnored = 0;
            br = new BufferedReader(new FileReader(weatherfilepath));
 
            System.out.println("Beginning import files - please standby ...");
                        
                while ((sCurrentLine = br.readLine()) != null) {
                    if(!(sCurrentLine.charAt(0) == '#')) {  //no headline
                    
                        if(Integer.parseInt(sLastWeatherIdYear) >= year) {
                                    
                                   if(++n%10000 == 0) System.out.print(n + " ..... ");

                                        String PRESS        = sCurrentLine.substring(0, 7);
                                        String OBSGPH       = sCurrentLine.substring(9, 15);
                                        String CALCGPH      = sCurrentLine.substring(16, 23);
                                        String TEMP         = sCurrentLine.substring(24, 31);
                                        String TEMPGRAD     = sCurrentLine.substring(32, 39);
                                        String PTEMP        = sCurrentLine.substring(40, 47);
                                        String PTEMPGRAD    = sCurrentLine.substring(48, 55);
                                        String VTEMP        = sCurrentLine.substring(56, 63);
                                        String VTEMPGRAD    = sCurrentLine.substring(64, 71);
                                        String VAPPRESS     = sCurrentLine.substring(72, 79);
                                        String SATVAP       = sCurrentLine.substring(80, 87);
                                        String RH           = sCurrentLine.substring(88, 95);
                                        String RHGRAD       = sCurrentLine.substring(96, 103);
                                        String UWND         = sCurrentLine.substring(104, 111);
                                        String UWDGRAD      = sCurrentLine.substring(112, 119);
                                        String VWND         = sCurrentLine.substring(120, 127);
                                        String VWNDGRAD     = sCurrentLine.substring(128, 135);
                                        String N            = sCurrentLine.substring(136, 143);

                                        presssum+=Integer.parseInt(PRESS);
                                        if(presssum > 1)    presscount++;   //pressum immer >=1 um divbyzero zu vermeiden
                                        
                                        tempsum+=(Integer.parseInt(TEMP)-273)/10;
                                        if(tempsum > 1)     tempsum++;      //tempsum immer >=1 um divbyzero zu vermeiden
                                        
                                    } else yearsIgnored++; 
                    
                    
                    } else {      //headline !
                        if(++n%10000 == 0) System.out.print(n + " ..... ");


                                        String WETTERID  = sCurrentLine.substring(1, 6);   //   2-  6
                                        String YEAR  = sCurrentLine.substring(6, 10);      //   7- 10
                                        String MONTH  = sCurrentLine.substring(10, 12);     //  11- 12
                                        String DAY  = sCurrentLine.substring(12, 14);       //  13- 14
                                        String HOUR  = sCurrentLine.substring(14, 16);      //  15- 16
                                        String RELTIME  = sCurrentLine.substring(16, 20);   //  17- 20
                                        String NUMLEV  = sCurrentLine.substring(20, 24);    //  21- 24
                                        String PW  = sCurrentLine.substring(24, 30);        //  25- 30
                                        String INVPRESS  = sCurrentLine.substring(30, 36);  //  31- 36
                                        String INVHGT  = sCurrentLine.substring(36, 42);    //  37- 42
                                        String INVTEMPDIF  = sCurrentLine.substring(42, 48);//  43- 48
                                        String MIXPRESS  = sCurrentLine.substring(48, 54);  //  49- 54
                                        String MIXHGT  = sCurrentLine.substring(54, 60);    //  55- 60
                                        String FRZPRESS  = sCurrentLine.substring(60, 66);  //  61- 66
                                        String FRZHGT  = sCurrentLine.substring(66, 72);    //  67- 72
                                        String LCLPRESS  = sCurrentLine.substring(72, 78);  //  73- 78
                                        String LCLHGT  = sCurrentLine.substring(78, 84);    //  79- 84
                                        String LFCPRESS  = sCurrentLine.substring(84, 90);  //  85- 90
                                        String LFCHGT  = sCurrentLine.substring(90, 96);    //  91- 96
                                        String LNBPRESS  = sCurrentLine.substring(96, 102);  //  97-102
                                        String LNBHGT  = sCurrentLine.substring(102, 108);    // 103-108
                                        String LI  = sCurrentLine.substring(106, 114);        // 109-114
                                        String SI  = sCurrentLine.substring(114, 120);        // 115-120
                                        String KI   = sCurrentLine.substring(120, 126);       // 121-126
                                        String TTI = sCurrentLine.substring(126, 132);        // 127-132
                                        String CAPE  = sCurrentLine.substring(132, 138);      // 133-138
                                        String CIN  = sCurrentLine.substring(138, 144);       // 139-144
                                        int TEMP     = (tempsum/tempcount);
                                        int PRESS = (presssum/presscount);

                                        //Variablen zuruecksetzen
                                        presssum = 0; presscount = 1;
                                        tempsum = 0; tempcount = 1;
                                        
                                        
                                        sLastWeatherId = WETTERID + YEAR + MONTH + DAY + HOUR + RELTIME;
                                        sLastWeatherIdYear = YEAR;

                                        if(Integer.parseInt(sLastWeatherIdYear) >= year) {


                                        BasicDBObject doc = new BasicDBObject("wetterid", WETTERID).
                                                        append("year", YEAR).
                                                        append("month", MONTH).
                                                        append("day", DAY).
                                                        append("hour", HOUR).
                                                        append("reltime", RELTIME).
                                                        append("numlev", NUMLEV).
                                                        append("pw", PW).
                                                        append("invpress", INVPRESS).
                                                        append("invhgt", INVHGT).
                                                        append("invtempdif", INVTEMPDIF).
                                                        append("mixpress", MIXPRESS).
                                                        append("mixhgt", MIXHGT).
                                                        append("frzpress", FRZPRESS).
                                                        append("frzhgt", FRZHGT).
                                                        append("lclpress", LCLPRESS).
                                                        append("lclhgt", LCLHGT).
                                                        append("lfcpress", LFCPRESS).
                                                        append("lfchgt", LFCHGT).
                                                        append("lnbpress", LNBPRESS).
                                                        append("lnbhgt", LNBHGT).
                                                        append("li", LI).
                                                        append("si", SI).
                                                        append("ki", KI).
                                                        append("tti", TTI).
                                                        append("cape", CAPE).
                                                        append("cin", CIN).
                                                        append("temp", TEMP).
                                                        append("press", PRESS);

                                        coll.insert(doc);
                                    } else yearsIgnored++;
				} 
			}
 
		
		
		
		DBCursor cursor = coll.find();
		
                System.out.println("\n\nDie ersten (max.) 10 Datensätze: ");
                int m = 0;
               
                while(cursor.hasNext()) {
                   System.out.println(cursor.next());
                   if(++m >= 10) break;

               }
               cursor.close();
		
		System.out.println("Collection " + mongocoll + " in Datenbank " + mongodb + " enthaelt nun " + coll.count() + " Datensaetze.");
		System.out.println("zu alte Datensaetze ignoriert (Parameter -y "+ year +"): " + yearsIgnored);
	
	
	
	}
	
        
        ////
        
        
	public static void wstations(String importfile) throws IOException {
		String collname = "wstations";
		String dbuser = "infosys";
		String dbpass = "InfoKirsten321";
		MongoClient mongoClient;
		mongoClient = new MongoClient( "127.0.0.1" );
		DB db = mongoClient.getDB( "test" );
		System.out.println("Try to connect:" + db.authenticate(dbuser, dbpass.toCharArray()));
		
		//alte collection verwerfen
		DBCollection coll = db.getCollection(collname);
		coll.drop();
		
		//zaehlvariable fuer wartebildschirm
		int n = 0;
		
		String weatherfilepath = new java.io.File( importfile ).getCanonicalPath();
        System.out.println("Trying to open file: " + weatherfilepath);
        
        BufferedReader br = null;
        
        
        
        
        Pattern pattern = Pattern.compile("^[0-9]{6}[ A-Z,0-9]{8}(?!SHIP)+.*");
        
        
		try {
 
			String sCurrentLine;
 
			br = new BufferedReader(new FileReader(weatherfilepath));
 
			while ((sCurrentLine = br.readLine()) != null) {
				Matcher matcher = pattern.matcher(sCurrentLine); 
				if(matcher.matches()) {	
					//System.out.println(sCurrentLine);
					////wait function 
					if(++n < 160 )System.out.print('.');
					else {n=0; System.out.println(".");}
					////
					
                                        
                                        //
                                        String wcode 	= sCurrentLine.substring(0, 6).trim();
					String wname 	= sCurrentLine.substring(14, 33).trim();
					String wcountry = sCurrentLine.substring(34, 36).trim();
					String wlat		= sCurrentLine.substring(37, 42).trim();
					String wlon 	= sCurrentLine.substring(44, 49).trim();
					
					BasicDBObject doc = new BasicDBObject("wcode", wcode).
							append("wname", wname).
							append("wcountry", wcountry).
							append("wlat", wlat).
							append("wlon", wlon);
							
					coll.insert(doc);
					
				}
			}
 
		} catch (IOException e) {
			e.printStackTrace();
        
		}
	
		
		
		DBCursor cursor = coll.find();
		try {
		   while(cursor.hasNext()) {
		       System.out.println(cursor.next());
		       
		   }
		} finally {
		   cursor.close();
		}

		System.out.println(coll.count());
		
	
	
	
	}

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) throws IOException {
	System.out.println("len: " + args.length);
        for (int i=0; i<args.length; i++) System.out.println("args["+i+"]: " + args[i]);
        
        
        String importfile   = "";	// -f
        String mongoip      = "";       // -i
        String mongoport    = "";       // -p
        String mongodb      = "";       // -d
        String mongocoll    = "";       // -c
        String mongouser    = "";       // -u 
        String mongopass    = "";       // -P
        Integer year        = 2000;     // -y

        if(args.length == 16) {
            for (int n = 0; n < (args.length-1); n++) {
                if (args[n].toString().equals("-f")) importfile = args[n+1].toString();
                if (args[n].toString().equals("-i")) mongoip    = args[n+1].toString();
                if (args[n].toString().equals("-p")) mongoport  = args[n+1].toString();
                if (args[n].toString().equals("-d")) mongodb    = args[n+1].toString();
                if (args[n].toString().equals("-c")) mongocoll  = args[n+1].toString();
                if (args[n].toString().equals("-u")) mongouser  = args[n+1].toString();
                if (args[n].toString().equals("-P")) mongopass  = args[n+1].toString();
                if (args[n].toString().equals("-y")) year       = Integer.parseInt(args[n+1].toString());
            } 
        
            //wstations();
            importall(importfile, mongoip, mongoport, mongodb, mongocoll, mongouser, mongopass, year);
            //test();
            
    
    
        
        } else {
            System.out.println("usage: jamo -f <imporfile> -i <mongoip> -p <mongoport> -d <db> -c <collection> -u <dbuser> -P <dbpass> -y <year>");
        
        }

        
        
        
                
    }
}
