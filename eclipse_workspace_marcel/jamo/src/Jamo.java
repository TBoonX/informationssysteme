
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

public class Jamo {

	
	public static void test() throws IOException {
		BufferedReader br = null;
		
		String sCurrentLine;
		
		String weatherfilepath = new java.io.File( "./2-headrecordsger.txt" ).getCanonicalPath();
        System.out.println("Trying to open file: " + weatherfilepath);
        
		
		br = new BufferedReader(new FileReader(weatherfilepath));

		while ((sCurrentLine = br.readLine()) != null) {
			System.out.println(sCurrentLine);
			System.out.println(" ID:" + sCurrentLine.substring(1, 6).trim());
			
		}
		
		
	}
	
	public static void headrecordsger() throws IOException {
		String collname = "headrecords";
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
		
		String weatherfilepath = new java.io.File( "./headrecordsger.txt" ).getCanonicalPath();
        System.out.println("Trying to open file: " + weatherfilepath);
        
        BufferedReader br = null;
        
        //Pattern pattern = Pattern.compile("^[0-9]{6}[ A-Z,0-9]{8}(?!SHIP)+.*");
        
        
		try {
 
			String sCurrentLine;
 
			br = new BufferedReader(new FileReader(weatherfilepath));
 
			while ((sCurrentLine = br.readLine()) != null) {
				//Matcher matcher = pattern.matcher(sCurrentLine); 
				//if(matcher.matches()) {	
					//System.out.println(sCurrentLine);
					////wait function 
					if(++n < 160 )System.out.print('.');
					else {n=0; System.out.println(".");}
					////
		
					String WETTERID  = sCurrentLine.substring(1, 6);        //   2-  6
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
					
					
					//String wcode 	= sCurrentLine.substring(0, 6).trim();
					//String wname 	= sCurrentLine.substring(14, 33).trim();
					//String wcountry = sCurrentLine.substring(34, 36).trim();
					//String wlat		= sCurrentLine.substring(37, 42).trim();
					//String wlon 	= sCurrentLine.substring(44, 49).trim();
					
					BasicDBObject doc = new BasicDBObject("wetterid", WETTERID).
							//append("wname", wname).
							//append("wcountry", wcountry).
							//append("wlat", wlat).
							//append("wlon", wlon);
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
							append("cin", CIN);
							
					coll.insert(doc);
					
				//}
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
	
	public static void wstations() throws IOException {
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
		
		String weatherfilepath = new java.io.File( "./Wetterstationen.list" ).getCanonicalPath();
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
	 * @param args
	 * @throws IOException 
	 */
	public static void main(String[] args) throws IOException {
		//wstations();
		headrecordsger();
		//test();
	}

}
