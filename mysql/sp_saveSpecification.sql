CREATE DEFINER=`lexus`@`localhost` PROCEDURE `sp_saveSpecification`(IN `category_param` VARCHAR(100), IN `spectype_param` VARCHAR(100), IN `specvalue_param` VARCHAR(100), OUT `specId` INT)
begin
declare isFound boolean;
declare nextPrime int;
set specId=0;
set isFound=false;
set nextPrime = -1;
if exists (select id from sepp_product_specification)
then
select distinct(common_specvalue) into specvalue_param from sepp_product_spec_config where category=category_param and spectype=spectype_param and specvalue=specvalue_param;
select primeid into specId from sepp_product_specification where category=category_param and spectype=spectype_param and specvalue=specvalue_param limit 1;
if specId!=0
then
set isFound = true;
end if;
end if;
if !isFound
then
select next_prime into nextPrime from sepp_prime where prime = (select max(primeid) from sepp_product_specification where category=category_param);
if nextPrime <2
then
set nextPrime =2;
end if;  
INSERT INTO sepp_product_specification(category,spectype, specvalue,primeid) VALUES (category_param, spectype_param, specvalue_param,nextPrime);
set specId = nextPrime;
end if;
select specId;
END