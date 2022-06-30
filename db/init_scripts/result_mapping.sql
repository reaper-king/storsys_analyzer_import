CREATE TABLE clinlims.analyzer_result_map


(
    analyzer_id bigint NOT NULL,
    test_id bigint NOT NULL,
    result_id bigint NOT NULL,
    import_value character varying(200) NOT NULL
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS clinlims.analyzer_result_map
    OWNER to clinlims;
COMMENT ON TABLE clinlims.analyzer_result_map
    IS 'Maps the analyzers test result to the test results in the database';