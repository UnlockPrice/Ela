CREATE DEFINER=`lexus`@`localhost` PROCEDURE `sp_savePrimeId`(IN `f_table` VARCHAR(1000), IN `f_id` VARCHAR(1000), IN `f_string` VARCHAR(1000), IN `f_delimiter` VARCHAR(5))
    COMMENT 'Split results '
BEGIN    
declare cnt int   default 0;
declare i int   default 0;
declare tmp decimal(50,0) default 1;
declare prime_mul decimal(50,0) default 1;
set cnt = func_split_TotalLength (f_string, f_delimiter);
while i <cnt
do
     set i = i + 1;
     set tmp = func_split (f_string, f_delimiter, i);
      
     if tmp > 0 
     then
      set prime_mul = prime_mul * tmp;
     end if;
     
end while;

SET @t1 =CONCAT('update ',f_table,' set prime_id=',prime_mul,' where product_identifier=''',f_id,'''');
PREPARE stmt3 FROM @t1;
EXECUTE stmt3;
DEALLOCATE PREPARE stmt3;

END