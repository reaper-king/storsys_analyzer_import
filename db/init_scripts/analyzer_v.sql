-- View: clinlims.analyzer_v

-- DROP VIEW clinlims.analyzer_v;

CREATE OR REPLACE VIEW clinlims.analyzer_v
 AS
 SELECT an.name AS analyzer,
    tr.tst_rslt_type AS test_result_type,
    atm.analyzer_id,
    atm.analyzer_test_name,
    atm.test_id,
    atm.lastupdated,
    dict.id AS result,
    dict.dict_entry
   FROM analyzer an
     JOIN analyzer_test_map atm ON atm.analyzer_id = an.id
     JOIN test_result tr ON tr.test_id = atm.test_id
     LEFT JOIN dictionary dict ON tr.value::text = dict.id::text
  ORDER BY atm.analyzer_id;

ALTER TABLE clinlims.analyzer_v
    OWNER TO clinlims;

