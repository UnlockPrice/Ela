CREATE DEFINER=`lexus`@`localhost` FUNCTION `func_split_TotalLength`(`f_string` VARCHAR(1000), `f_delimiter` VARCHAR(5)) RETURNS int(11)
    COMMENT 'Calculate the total length of the incoming string'
return 1 + (length (f_string) - length (replace (f_string, f_delimiter,'')))