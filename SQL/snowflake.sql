use database STOCKS;
use schema ALPACA;

create or replace secure materialized view STOCKS.ALPACA.MINUTE_TICKS as
select 
PARSE_JSON(MSG:body):symbol::STRING AS SYMBOL
,PARSE_JSON(MSG:body):volume AS VOL
,PARSE_JSON(MSG:body):accumulatedVolume AS ACCUMULATEDVOLUME
,PARSE_JSON(MSG:body):vwap AS VWAP

,PARSE_JSON(MSG:body):officialOpenPrice AS OFFICIALOPEN
,PARSE_JSON(MSG:body):openPrice AS OPEN
,PARSE_JSON(MSG:body):lowPrice AS LOW
,PARSE_JSON(MSG:body):highPrice AS HIGH
,PARSE_JSON(MSG:body):closePrice AS CLOSE
,PARSE_JSON(MSG:body):averagePrice AS AVERAGEPRICE
,iff(OFFICIALOPEN = 0, 0, ((HIGH - OFFICIALOPEN)/OFFICIALOPEN) * 100) as OPEN_PCT_CHANGE

,convert_timezone('UTC', 'America/New_York',to_timestamp_ntz(PARSE_JSON(MSG:body):startEpochTime::NUMBER/1000)) AS STARTTIME
,convert_timezone('UTC', 'America/New_York',to_timestamp_ntz(PARSE_JSON(MSG:body):endEpochTime::NUMBER/1000)) AS ENDTIME
,PARSE_JSON(MSG:body):ev::STRING AS EV,
HASH(SYMBOL || STARTTIME)::STRING AS ID

from "RAPID_DB"."PUBLIC"."RAPID_TABLE"
where MSG:topic = '5a63617e-3a3b-11eb-adc1-0242ac120002:AM.*'
;




select distinct symbol
from "ZEPL_US_STOCKS_DAILY"."PUBLIC"."COMPANY_PROFILE"
--where exchange = 'New York Stock Exchange';
where exchange = 'NYSE Arca';


select *
from "STOCKS"."ALPACA"."MINUTE_TICKS"

;


//show all running quiries
select *
from table(information_schema.query_history())
where EXECUTION_STATUS='RUNNING'
order by start_time;




select SYMBOL AS NAME, EXCHANGE as PARENT, MKTCAP as VALUE
    from "ZEPL_US_STOCKS_DAILY"."PUBLIC"."COMPANY_PROFILE"
    --where exchange = 'New York Stock Exchange';
    where exchange = 'NYSE Arca'
;

select exchange, count(*)
    from "ZEPL_US_STOCKS_DAILY"."PUBLIC"."COMPANY_PROFILE"
group by 1
order by 2 desc
;

select *
from "ZEPL_US_STOCKS_DAILY"."PUBLIC"."COMPANY_PROFILE"
;

select *
from "ZEPL_US_STOCKS_DAILY"."PUBLIC"."STOCK_HISTORY"
where SYMBOL = 'AAPL'
order by date desc
;




select SYMBOL AS SYMBOL, EXCHANGE as EXCHANGE, MKTCAP as VALUE, industry
        from "ZEPL_US_STOCKS_DAILY"."PUBLIC"."COMPANY_PROFILE"
        order by MKTCAP DESC
;

select distinct industry, count(*)
from "ZEPL_US_STOCKS_DAILY"."PUBLIC"."COMPANY_PROFILE"
group by 1
;


select SYMBOL AS SYMBOL, EXCHANGE as EXCHANGE, MKTCAP as VALUE, 100 as EQ, *
        from "ZEPL_US_STOCKS_DAILY"."PUBLIC"."COMPANY_PROFILE"
        //where symbol = 'AAPL'
        where MKTCAP is not null
        order by MKTCAP DESC
        limit 500;
        
select *
from "ZEPL_US_STOCKS_DAILY"."PUBLIC"."SYMBOLS" A
left outer join (
  select SYMBOL, ((HIGH - OFFICIALOPEN)/OFFICIALOPEN) * 100 as PCT_CHANGE
  from "STOCKS"."ALPACA"."MINUTE_TICKS"
  where OFFICIALOPEN > 0
)B on A.SYMBOL = B.SYMBOL AND
A.SYMBOL in ('MMM','ABT','ABBV','ABMD','ACN','ATVI','ADBE','AMD','AAP','AES','AFL','A','APD','AKAM','ALK','ALB','ARE','ALXN','ALGN','ALLE','LNT','ALL','GOOGL','GOOG','MO','AMZN','AMCR','AEE','AAL','AEP','AXP','AIG','AMT','AWK','AMP','ABC','AME','AMGN','APH','ADI','ANSS','ANTM','AON','AOS','APA','AAPL','AMAT','APTV','ADM','ANET','AJG','AIZ','T','ATO','ADSK','ADP','AZO','AVB','AVY','BKR','BLL','BAC','BK','BAX','BDX','BRK.B','BBY','BIO','BIIB','BLK','BA','BKNG','BWA','BXP','BSX','BMY','AVGO','BR','BF.B','CHRW','COG','CDNS','CPB','COF','CAH','KMX','CCL','CARR','CTLT','CAT','CBOE','CBRE','CDW','CE','CNC','CNP','CERN','CF','SCHW','CHTR','CVX','CMG','CB','CHD','CI','CINF','CTAS','CSCO','C','CFG','CTXS','CLX','CME','CMS','KO','CTSH','CL','CMCSA','CMA','CAG','CXO','COP','ED','STZ','COO','CPRT','GLW','CTVA','COST','CCI','CSX','CMI','CVS','DHI','DHR','DRI','DVA','DE','DAL','XRAY','DVN','DXCM','FANG','DLR','DFS','DISCA','DISCK','DISH','DG','DLTR','D','DPZ','DOV','DOW','DTE','DUK','DRE','DD','DXC','EMN','ETN','EBAY','ECL','EIX','EW','EA','EMR','ETR','EOG','EFX','EQIX','EQR','ESS','EL','ETSY','EVRG','ES','RE','EXC','EXPE','EXPD','EXR','XOM','FFIV','FB','FAST','FRT','FDX','FIS','FITB','FE','FRC','FISV','FLT','FLIR','FLS','FMC','F','FTNT','FTV','FBHS','FOXA','FOX','BEN','FCX','GPS','GRMN','IT','GD','GE','GIS','GM','GPC','GILD','GL','GPN','GS','GWW','HAL','HBI','HIG','HAS','HCA','PEAK','HSIC','HSY','HES','HPE','HLT','HFC','HOLX','HD','HON','HRL','HST','HWM','HPQ','HUM','HBAN','HII','IEX','IDXX','INFO','ITW','ILMN','INCY','IR','INTC','ICE','IBM','IP','IPG','IFF','INTU','ISRG','IVZ','IPGP','IQV','IRM','JKHY','J','JBHT','SJM','JNJ','JCI','JPM','JNPR','KSU','K','KEY','KEYS','KMB','KIM','KMI','KLAC','KHC','KR','LB','LHX','LH','LRCX','LW','LVS','LEG','LDOS','LEN','LLY','LNC','LIN','LYV','LKQ','LMT','L','LOW','LUMN','LYB','MTB','MRO','MPC','MKTX','MAR','MMC','MLM','MAS','MA','MKC','MXIM','MCD','MCK','MDT','MRK','MET','MTD','MGM','MCHP','MU','MSFT','MAA','MHK','TAP','MDLZ','MNST','MCO','MS','MOS','MSI','MSCI','NDAQ','NOV','NTAP','NFLX','NWL','NEM','NWSA','NWS','NEE','NLSN','NKE','NI','NSC','NTRS','NOC','NLOK','NCLH','NRG','NUE','NVDA','NVR','ORLY','OXY','ODFL','OMC','OKE','ORCL','OTIS','PCAR','PKG','PH','PAYX','PAYC','PYPL','PNR','PBCT','PEP','PKI','PRGO','PFE','PM','PSX','PNW','PXD','PNC','POOL','PPG','PPL','PFG','PG','PGR','PLD','PRU','PEG','PSA','PHM','PVH','QRVO','PWR','QCOM','DGX','RL','RJF','RTX','O','REG','REGN','RF','RSG','RMD','RHI','ROK','ROL','ROP','ROST','RCL','SPGI','CRM','SBAC','SLB','STX','SEE','SRE','NOW','SHW','SPG','SWKS','SLG','SNA','SO','LUV','SWK','SBUX','STT','STE','SYK','SIVB','SYF','SNPS','SYY','TMUS','TROW','TTWO','TPR','TGT','TEL','FTI','TDY','TFX','TER','TSLA','TXN','TXT','TMO','TIF','TJX','TSCO','TT','TDG','TRV','TFC','TWTR','TYL','TSN','UDR','ULTA','USB','UAA','UA','UNP','UAL','UNH','UPS','URI','UHS','UNM','VLO','VAR','VTR','VRSN','VRSK','VZ','VRTX','VFC','VIAC','VTRS','V','VNT','VNO','VMC','WRB','WAB','WMT','WBA','DIS','WM','WAT','WEC','WFC','WELL','WST','WDC','WU','WRK','WY','WHR','WMB','WLTW','WYNN','XEL','XRX','XLNX','XYL','YUM','ZBRA','ZBH','ZION','ZTS')
and B.SYMBOL in ('MMM','ABT','ABBV','ABMD','ACN','ATVI','ADBE','AMD','AAP','AES','AFL','A','APD','AKAM','ALK','ALB','ARE','ALXN','ALGN','ALLE','LNT','ALL','GOOGL','GOOG','MO','AMZN','AMCR','AEE','AAL','AEP','AXP','AIG','AMT','AWK','AMP','ABC','AME','AMGN','APH','ADI','ANSS','ANTM','AON','AOS','APA','AAPL','AMAT','APTV','ADM','ANET','AJG','AIZ','T','ATO','ADSK','ADP','AZO','AVB','AVY','BKR','BLL','BAC','BK','BAX','BDX','BRK.B','BBY','BIO','BIIB','BLK','BA','BKNG','BWA','BXP','BSX','BMY','AVGO','BR','BF.B','CHRW','COG','CDNS','CPB','COF','CAH','KMX','CCL','CARR','CTLT','CAT','CBOE','CBRE','CDW','CE','CNC','CNP','CERN','CF','SCHW','CHTR','CVX','CMG','CB','CHD','CI','CINF','CTAS','CSCO','C','CFG','CTXS','CLX','CME','CMS','KO','CTSH','CL','CMCSA','CMA','CAG','CXO','COP','ED','STZ','COO','CPRT','GLW','CTVA','COST','CCI','CSX','CMI','CVS','DHI','DHR','DRI','DVA','DE','DAL','XRAY','DVN','DXCM','FANG','DLR','DFS','DISCA','DISCK','DISH','DG','DLTR','D','DPZ','DOV','DOW','DTE','DUK','DRE','DD','DXC','EMN','ETN','EBAY','ECL','EIX','EW','EA','EMR','ETR','EOG','EFX','EQIX','EQR','ESS','EL','ETSY','EVRG','ES','RE','EXC','EXPE','EXPD','EXR','XOM','FFIV','FB','FAST','FRT','FDX','FIS','FITB','FE','FRC','FISV','FLT','FLIR','FLS','FMC','F','FTNT','FTV','FBHS','FOXA','FOX','BEN','FCX','GPS','GRMN','IT','GD','GE','GIS','GM','GPC','GILD','GL','GPN','GS','GWW','HAL','HBI','HIG','HAS','HCA','PEAK','HSIC','HSY','HES','HPE','HLT','HFC','HOLX','HD','HON','HRL','HST','HWM','HPQ','HUM','HBAN','HII','IEX','IDXX','INFO','ITW','ILMN','INCY','IR','INTC','ICE','IBM','IP','IPG','IFF','INTU','ISRG','IVZ','IPGP','IQV','IRM','JKHY','J','JBHT','SJM','JNJ','JCI','JPM','JNPR','KSU','K','KEY','KEYS','KMB','KIM','KMI','KLAC','KHC','KR','LB','LHX','LH','LRCX','LW','LVS','LEG','LDOS','LEN','LLY','LNC','LIN','LYV','LKQ','LMT','L','LOW','LUMN','LYB','MTB','MRO','MPC','MKTX','MAR','MMC','MLM','MAS','MA','MKC','MXIM','MCD','MCK','MDT','MRK','MET','MTD','MGM','MCHP','MU','MSFT','MAA','MHK','TAP','MDLZ','MNST','MCO','MS','MOS','MSI','MSCI','NDAQ','NOV','NTAP','NFLX','NWL','NEM','NWSA','NWS','NEE','NLSN','NKE','NI','NSC','NTRS','NOC','NLOK','NCLH','NRG','NUE','NVDA','NVR','ORLY','OXY','ODFL','OMC','OKE','ORCL','OTIS','PCAR','PKG','PH','PAYX','PAYC','PYPL','PNR','PBCT','PEP','PKI','PRGO','PFE','PM','PSX','PNW','PXD','PNC','POOL','PPG','PPL','PFG','PG','PGR','PLD','PRU','PEG','PSA','PHM','PVH','QRVO','PWR','QCOM','DGX','RL','RJF','RTX','O','REG','REGN','RF','RSG','RMD','RHI','ROK','ROL','ROP','ROST','RCL','SPGI','CRM','SBAC','SLB','STX','SEE','SRE','NOW','SHW','SPG','SWKS','SLG','SNA','SO','LUV','SWK','SBUX','STT','STE','SYK','SIVB','SYF','SNPS','SYY','TMUS','TROW','TTWO','TPR','TGT','TEL','FTI','TDY','TFX','TER','TSLA','TXN','TXT','TMO','TIF','TJX','TSCO','TT','TDG','TRV','TFC','TWTR','TYL','TSN','UDR','ULTA','USB','UAA','UA','UNP','UAL','UNH','UPS','URI','UHS','UNM','VLO','VAR','VTR','VRSN','VRSK','VZ','VRTX','VFC','VIAC','VTRS','V','VNT','VNO','VMC','WRB','WAB','WMT','WBA','DIS','WM','WAT','WEC','WFC','WELL','WST','WDC','WU','WRK','WY','WHR','WMB','WLTW','WYNN','XEL','XRX','XLNX','XYL','YUM','ZBRA','ZBH','ZION','ZTS')
order by A.SYMBOL
;



WITH
MXDATE(SYMBOL, MAX_DATE, MX_PRICE) AS(
    SELECT MT.SYMBOL, MAX(STARTTIME) as MAX_DATE, HIGH
    FROM STOCKS.ALPACA.MINUTE_TICKS MT INNER JOIN(
        SELECT SYMBOL, MAX(STARTTIME) AS T
        FROM STOCKS.ALPACA.MINUTE_TICKS
        GROUP BY 1
    )MX ON MX.SYMBOL = MT.SYMBOL and MT.STARTTIME = MX.T
    GROUP BY 1, 3
)

select s.symbol as symbol, MONTH(starttime)||'/'||DAY(starttime)||'/'||YEAR(starttime)||' '|| HOUR(starttime)||':'|| RIGHT('00'||MINUTE(starttime),2) as time, 
        high, mx_price, S.ID
from STOCKS.ALPACA.MINUTE_TICKS S 
INNER JOIN MXDATE MD ON S.SYMBOL = MD.SYMBOL --AND MD.MAX_DATE = S.STARTTIME
WHERE ID IN ('-6917787719846433697','-4911267735752816398','-8787633607336265495')
;




CREATE OR REPLACE SECURE VIEW PCT_CHANGE_SINCE_OPEN AS
WITH
MXDATE(SYMBOL, MAX_DATE) AS(
  SELECT SYMBOL, MAX(STARTTIME) as MAX_DATE 
  FROM STOCKS.ALPACA.MINUTE_TICKS
  GROUP BY 1
)

select S.SYMBOL, MAX_DATE, S.OPEN_PCT_CHANGE as PCT_CHANGE, OFFICIALOPEN, HIGH
from STOCKS.ALPACA.MINUTE_TICKS S 
INNER JOIN MXDATE MD ON S.SYMBOL = MD.SYMBOL AND MD.MAX_DATE = S.STARTTIME

ORDER BY PCT_CHANGE DESC
;

select *
from PCT_CHANGE_SINCE_OPEN;


        



use database anondb;
create or replace table timetable(t TIMESTAMP_LTZ); // LTZ Is local time zone
insert into timetable select current_timestamp(); // insert test value

alter session set timezone = 'Europe/London'; // see what the time is in london
highselect * from timetable;
alter session set timezone = 'America/Los_Angeles'; // see what the time is in LA
        
        
        
        
        
select SYMBOL AS SYMBOL, 'EXCHANGE' as EXCHANGE, 100 as EQ, PCT_CHANGE as PCT_CHANGE
from STOCKS.ALPACA.PCT_CHANGE_SINCE_OPEN
where SYMBOL in ('MMM','ABT','ABBV','ABMD','ACN','ATVI','ADBE','AMD','AAP','AES','AFL','A','APD','AKAM','ALK','ALB','ARE','ALXN','ALGN','ALLE','LNT','ALL','GOOGL','GOOG','MO','AMZN','AMCR','AEE','AAL','AEP','AXP','AIG','AMT','AWK','AMP','ABC','AME','AMGN','APH','ADI','ANSS','ANTM','AON','AOS','APA','AAPL','AMAT','APTV','ADM','ANET','AJG','AIZ','T','ATO','ADSK','ADP','AZO','AVB','AVY','BKR','BLL','BAC','BK','BAX','BDX','BRK.B','BBY','BIO','BIIB','BLK','BA','BKNG','BWA','BXP','BSX','BMY','AVGO','BR','BF.B','CHRW','COG','CDNS','CPB','COF','CAH','KMX','CCL','CARR','CTLT','CAT','CBOE','CBRE','CDW','CE','CNC','CNP','CERN','CF','SCHW','CHTR','CVX','CMG','CB','CHD','CI','CINF','CTAS','CSCO','C','CFG','CTXS','CLX','CME','CMS','KO','CTSH','CL','CMCSA','CMA','CAG','CXO','COP','ED','STZ','COO','CPRT','GLW','CTVA','COST','CCI','CSX','CMI','CVS','DHI','DHR','DRI','DVA','DE','DAL','XRAY','DVN','DXCM','FANG','DLR','DFS','DISCA','DISCK','DISH','DG','DLTR','D','DPZ','DOV','DOW','DTE','DUK','DRE','DD','DXC','EMN','ETN','EBAY','ECL','EIX','EW','EA','EMR','ETR','EOG','EFX','EQIX','EQR','ESS','EL','ETSY','EVRG','ES','RE','EXC','EXPE','EXPD','EXR','XOM','FFIV','FB','FAST','FRT','FDX','FIS','FITB','FE','FRC','FISV','FLT','FLIR','FLS','FMC','F','FTNT','FTV','FBHS','FOXA','FOX','BEN','FCX','GPS','GRMN','IT','GD','GE','GIS','GM','GPC','GILD','GL','GPN','GS','GWW','HAL','HBI','HIG','HAS','HCA','PEAK','HSIC','HSY','HES','HPE','HLT','HFC','HOLX','HD','HON','HRL','HST','HWM','HPQ','HUM','HBAN','HII','IEX','IDXX','INFO','ITW','ILMN','INCY','IR','INTC','ICE','IBM','IP','IPG','IFF','INTU','ISRG','IVZ','IPGP','IQV','IRM','JKHY','J','JBHT','SJM','JNJ','JCI','JPM','JNPR','KSU','K','KEY','KEYS','KMB','KIM','KMI','KLAC','KHC','KR','LB','LHX','LH','LRCX','LW','LVS','LEG','LDOS','LEN','LLY','LNC','LIN','LYV','LKQ','LMT','L','LOW','LUMN','LYB','MTB','MRO','MPC','MKTX','MAR','MMC','MLM','MAS','MA','MKC','MXIM','MCD','MCK','MDT','MRK','MET','MTD','MGM','MCHP','MU','MSFT','MAA','MHK','TAP','MDLZ','MNST','MCO','MS','MOS','MSI','MSCI','NDAQ','NOV','NTAP','NFLX','NWL','NEM','NWSA','NWS','NEE','NLSN','NKE','NI','NSC','NTRS','NOC','NLOK','NCLH','NRG','NUE','NVDA','NVR','ORLY','OXY','ODFL','OMC','OKE','ORCL','OTIS','PCAR','PKG','PH','PAYX','PAYC','PYPL','PNR','PBCT','PEP','PKI','PRGO','PFE','PM','PSX','PNW','PXD','PNC','POOL','PPG','PPL','PFG','PG','PGR','PLD','PRU','PEG','PSA','PHM','PVH','QRVO','PWR','QCOM','DGX','RL','RJF','RTX','O','REG','REGN','RF','RSG','RMD','RHI','ROK','ROL','ROP','ROST','RCL','SPGI','CRM','SBAC','SLB','STX','SEE','SRE','NOW','SHW','SPG','SWKS','SLG','SNA','SO','LUV','SWK','SBUX','STT','STE','SYK','SIVB','SYF','SNPS','SYY','TMUS','TROW','TTWO','TPR','TGT','TEL','FTI','TDY','TFX','TER','TSLA','TXN','TXT','TMO','TIF','TJX','TSCO','TT','TDG','TRV','TFC','TWTR','TYL','TSN','UDR','ULTA','USB','UAA','UA','UNP','UAL','UNH','UPS','URI','UHS','UNM','VLO','VAR','VTR','VRSN','VRSK','VZ','VRTX','VFC','VIAC','VTRS','V','VNT','VNO','VMC','WRB','WAB','WMT','WBA','DIS','WM','WAT','WEC','WFC','WELL','WST','WDC','WU','WRK','WY','WHR','WMB','WLTW','WYNN','XEL','XRX','XLNX','XYL','YUM','ZBRA','ZBH','ZION','ZTS')
order by PCT_CHANGE DESC 
;



show pipes in account;

select CSO.SYMBOL, HOUR(MAX_DATE)||':'||MINUTE(MAX_DATE) AS T, PCT_CHANGE, CSO.OFFICIALOPEN, CSO.HIGH,
       ACCUMULATEDVOLUME, AVERAGEPRICE, VWAP
from STOCKS.ALPACA.PCT_CHANGE_SINCE_OPEN  CSO
left outer join STOCKS.ALPACA.MINUTE_TICKS MT ON CSO.SYMBOL = MT.SYMBOL AND CSO.MAX_DATE = MT.STARTTIME
;

select *, vwap - officialopen
from "STOCKS"."ALPACA"."MINUTE_TICKS"
order by vwap - officialopen desc
;



SELECT *
FROM STOCKS.ALPACA.MINUTE_TICKS
;




select *
from RAPID_DB.PUBLIC.RAPID_STREAM
;

alter task STOCKS.ALPACA.NEW_TICKERS suspend;
alter task STOCKS.ALPACA.NEW_TICKERS resume;
alter task STOCKS.ALPACA.UPDATE_SCREENER resume;
alter task STOCKS.ALPACA.CREATE_PNL resume;
show tasks in account;


create or replace task STOCKS.ALPACA.NEW_TICKERS
warehouse=SNOWSTOCK_WH
schedule='1 minute'
WHEN
  SYSTEM$STREAM_HAS_DATA('RAPID_DB.PUBLIC.RAPID_STREAM')
as 
    // RESET THE STREAM
    create or replace stream RAPID_DB.PUBLIC.RAPID_STREAM on table RAPID_DB.PUBLIC.RAPID_TABLE;
;




create or replace procedure  STOCKS.ALPACA.UPDATE_SCREENER_PROC()
    returns string
    language javascript
    strict
    execute as owner
    as
$$
  var SQL = 
  `CREATE OR REPLACE TABLE STOCKS.PUBLIC.SCREENER2 AS
      select CSO.SYMBOL, RIGHT('00'||MONTH(MAX_DATE),2)||'/'|| RIGHT('00'||DAY(MAX_DATE),2) ||'/'|| RIGHT(YEAR(MAX_DATE),2)||' '||RIGHT('00'||HOUR(MAX_DATE),2)||':'|| RIGHT('00'||MINUTE(MAX_DATE),2) AS T, 
      PCT_CHANGE, CSO.OFFICIALOPEN, CSO.HIGH as HIGH, ACCUMULATEDVOLUME, AVERAGEPRICE, VWAP, ifnull(MKTCAP,0)AS MKTCAP, ifnull(LASTDIV,0) AS LASTDIV, 
      ifnull(RANGE,'') AS RANGE, ifnull(EXCHANGE,'') AS EXCHANGE, ifnull(INDUSTRY,'') AS INDUSTRY, ifnull(SECTOR,'') AS SECTOR,
      MT.ID::STRING AS SYM_ID, COMPANYNAME as NAME
          from STOCKS.ALPACA.PCT_CHANGE_SINCE_OPEN CSO
          left outer join STOCKS.ALPACA.MINUTE_TICKS MT ON CSO.SYMBOL = MT.SYMBOL AND CSO.MAX_DATE = MT.STARTTIME
          left outer join ZEPL_US_STOCKS_DAILY.PUBLIC.COMPANY_PROFILE CC ON CC.SYMBOL = MT.SYMBOL;`

  snowflake.execute( { sqlText: SQL });

  SQL = `ALTER TABLE STOCKS.PUBLIC.SCREENER SWAP WITH STOCKS.PUBLIC.SCREENER2`;
  snowflake.execute( { sqlText: SQL });

  SQL = `DROP TABLE STOCKS.PUBLIC.SCREENER2`;
  snowflake.execute( { sqlText: SQL });

$$;


create or replace task STOCKS.ALPACA.UPDATE_SCREENER
warehouse=SNOWSTOCK_WH
after STOCKS.ALPACA.NEW_TICKERS
as 
    call STOCKS.ALPACA.UPDATE_SCREENER_PROC()
;

alter task STOCKS.ALPACA.NEW_TICKERS suspend;
alter task STOCKS.ALPACA.NEW_TICKERS resume;
alter task STOCKS.ALPACA.UPDATE_SCREENER resume;
alter task STOCKS.ALPACA.CREATE_PNL resume;
show tasks in account;


create or replace secure materialized view STOCKS.UI.PORTFOLIO_LIST as
select 
distinct P.value:id::string as ID
, P.value:name::String as name
, P.value:assets as assets
,ARRAY_SIZE(P.value:assets) as ASSET_COUNT
,A.value:sym_id::string as sym_id
,A.value:ticker::string as symbol
,A.value:units::number as units
,MSG:body.uuid::string as USERID
,MSG:body.usertag::string as USERTAG

from "RAPID_DB"."PUBLIC"."RAPID_TABLE",
        lateral flatten(input => MSG:body.portfolio ) P,
        lateral flatten(input => P.value:assets) A
where MSG:topic like 'snowflake-asset-ui-demo%'
;




create or replace task STOCKS.ALPACA.CREATE_PNL
warehouse=SNOWSTOCK_WH
after STOCKS.ALPACA.NEW_TICKERS
as 

insert overwrite into STOCKS.UI.PORTFOLIO_PNL
select 
    P.ID AS PORTFOLIO_ID, 
    NAME AS NAME, 
    ASSET_COUNT, 
    UNITS, 
    P.USERID,
    P.USERTAG,
    P.SYMBOL AS SYMBOL, 
    mx.id::STRING AS PURCHASE_ID, 
    mt.starttime as PURCHASE_TIME, 
    MT.HIGH AS PURCHASE_PRICE, 
    SYM_ID AS LAST_ID, 
    MX.LASTTIME AS LAST_TIME, 
    MX.HIGH AS LAST_PRICE,

    purchase_price * units AS PURCHASE_VAL,
    last_price * units AS PMV,
    PURCHASE_VAL - PMV as DIFF

    from STOCKS.UI.PORTFOLIO_LIST P
    join STOCKS.ALPACA.MINUTE_TICKS MT on p.sym_id = mt.id
    left outer join(
        select mx.symbol, id::string as ID, HIGH, starttime as lasttime
        from STOCKS.ALPACA.MINUTE_TICKS MT inner join (
            select symbol, max(starttime)as st
            from STOCKS.ALPACA.MINUTE_TICKS
            group by 1) MX on mt.symbol = mx.symbol and starttime = mx.st
    ) MX on mt.symbol = mx.symbol
    order by name, symbol
;


create or replace secure materialized view STOCKS.UI.PORTFOLIO_PERF as
  select 
  PORTFOLIO_ID
  ,NAME
  ,USERID
  ,USERTAG
  ,MAX(ASSET_COUNT) as ASSET_COUNT
  ,SUM(PURCHASE_VAL) AS VAL
  ,SUM(PMV) AS TPMV
  ,TPMV-VAL AS PROFITLOSS
  ,PROFITLOSS / VAL * 100 as PERFORMANCE_PCT

  from STOCKS.UI.PORTFOLIO_PNL
  group by 1,2,3,4
;













                
                
                
