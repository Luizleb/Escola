-- Consulta total de mensalidades previstas liquidas
select format(sum(s.net),2) as total, format(sum(s.gross) - sum(s.net),2) as discounts from (select r.reg_name, r.`reg_grade`, g.grade, format(t.tui_value,2) as gross, r.`reg_discount` as discount, format(t.`tui_value`*(1-r.reg_discount),2) as net 
	from register r 
		inner join grade g on r.reg_grade = g.id 
		inner join tuition t on r.reg_grade = t.id) as s;
		
-- Consulta total de descontos previstos por tipo de desconto
select s.type, format(sum(s.discount*s.gross),2) as total from (select r.reg_name, r.`reg_grade`, g.grade, format(t.tui_value,2) as gross, r.`reg_discount` as discount, r.`reg_disc_type` as type, format(t.`tui_value`*(1-r.reg_discount),2) as net 
	from register r 
		inner join grade g on r.reg_grade = g.id 
		inner join tuition t on r.reg_grade = t.id) as s group by s.type having s.type<>'null';
		
-- Consulta mensalidade bruta e com desconto
select r.reg_name, r.`reg_grade`, g.grade, format(t.tui_value,2) as gross, r.`reg_discount` as discount, r.`reg_disc_type` as type, format(t.`tui_value`*(1-r.reg_discount),2) as net 
	from register r 
		inner join grade g on r.reg_grade = g.id 
		inner join tuition t on r.reg_grade = t.id;
        
-- Consulta final para pagamentos mensais por aluno
SELECT d.id, d.due_name, d.due_date, r.reg_name, g.`grade`, t.`tui_value`*(1-r.`reg_discount`) as net, p.`pay_actual_value`, p.`pay_actual_date`
	FROM duedates d
        INNER JOIN register r ON r.id = 126
        INNER JOIN grade g ON r.`reg_grade` = g.id 
        INNER JOIN tuition t ON g.`id` = t.`tui_grade_id`
        LEFT JOIN payments p ON d.id = p.pay_due_date_id AND p.pay_reg_id = 126
        ORDER BY d.id;
        
--  Total de pagamentos realizados de cada mensalidade
 SELECT d.due_name, format(sum(p.`pay_actual_value`),2) as total
 	FROM duedates d
 		LEFT JOIN payments p ON d.id = p.`pay_due_date_id`
 		GROUP BY due_name
 		ORDER BY d.id;
        
-- Total de mensalidades pagas em cada mês
SELECT month(p.`pay_actual_date`) as month, format(sum(p.`pay_actual_value`),2) as total FROM payments p
	GROUP BY month(p.`pay_actual_date`);
        


