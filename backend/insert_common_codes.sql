-- Insert Sample Common Codes
INSERT INTO "common_code" ("type", "code", "valueKo", "valueEn", "valueLo", "valueZh", "order", "isActive")
VALUES 
-- Car Brands
('CAR_BRAND', 'HYUNDAI', '현대', 'Hyundai', 'ຮຸນໄດ', '现代', 1, true),
('CAR_BRAND', 'KIA', '기아', 'Kia', 'ເກຍ', '起亚', 2, true),
('CAR_BRAND', 'TOYOTA', '도요타', 'Toyota', 'ໂຕໂຍຕ້າ', '丰田', 3, true),
('CAR_BRAND', 'FORD', '포드', 'Ford', 'ຟອດ', '福特', 4, true),

-- Real Estate Types
('ESTATE_TYPE', 'APARTMENT', '아파트', 'Apartment', 'ອາພາດເມັນ', '公寓', 1, true),
('ESTATE_TYPE', 'HOUSE', '주택', 'House', 'ເຮືອນ', '住宅', 2, true),
('ESTATE_TYPE', 'LAND', '토지', 'Land', 'ທີ່ດິນ', '土地', 3, true),

-- Job Industries
('JOB_TYPE', 'IT', 'IT/개발', 'IT/Dev', 'ໄອທີ', 'IT/开发', 1, true),
('JOB_TYPE', 'SERVICE', '서비스', 'Service', 'ບໍລິການ', '服务', 2, true),
('JOB_TYPE', 'CONSTRUCTION', '건설', 'Construction', 'ກໍ່ສ້າງ', '建设', 3, true);
