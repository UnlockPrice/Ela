CREATE DEFINER=`lexus`@`localhost` FUNCTION `func_split`(`f_string` VARCHAR(1000), `f_delimiter` VARCHAR(5), `f_order` INT) RETURNS varchar(255) CHARSET latin1
    COMMENT 'Split the incoming string, returns the split string'
begin
declare result varchar (255) default   '';
set result = reverse (substring_index (reverse (substring_index (f_string, f_delimiter, f_order)), f_delimiter, 1));
return result;
end