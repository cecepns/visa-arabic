-- Add editable visa document fields (run once on existing databases)
USE visa_system;

ALTER TABLE visa_applicants
  ADD COLUMN place_of_issue VARCHAR(255) DEFAULT 'Saudi Digital Embassy - السفارة السعودية الرقمية' AFTER sponsor_name,
  ADD COLUMN border_no VARCHAR(50) DEFAULT NULL AFTER place_of_issue,
  ADD COLUMN local_service VARCHAR(50) DEFAULT NULL AFTER border_no;
