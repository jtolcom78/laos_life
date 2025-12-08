
import { DataSource } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { Category, CategoryGroup } from '../entities/category.entity';
import { Product } from '../entities/product.entity';
import { RealEstate } from '../entities/real-estate.entity';
import { Job } from '../entities/job.entity';
import { Shop } from '../entities/shop.entity';
import { Post } from '../entities/post.entity';
import { Car } from '../entities/car.entity';
import { CommonCode } from '../common-code/entities/common-code.entity';
import { Banner } from '../banners/entities/banner.entity';
import { AccessLog } from '../access-log/entities/access-log.entity';
import { faker } from '@faker-js/faker';

// Real Data Mock Arrays
const LOCATIONS = ['Vientiane', 'Sikhottabong', 'Sisattanak', 'Chanthabuly', 'Xaysetha', 'Luang Prabang', 'Vang Vieng', 'Pakse', 'Savannakhet'];
const LAOS_FOODS = ['Khao Piak', 'Larb', 'Mok Pa', 'Tam Mak Hoong', 'Khao Jee', 'Sai Oua', 'Or Lam', 'Beer Lao', 'Khao Poon'];
const CAR_MODELS = [
    { brand: 'Hyundai', models: ['Starex', 'Elantra', 'Tucson', 'Santa Fe', 'Accent'] },
    { brand: 'Toyota', models: ['Hilux Revo', 'Fortuner', 'Camry', 'Vios', 'Corolla Cross', 'Land Cruiser'] },
    { brand: 'Kia', models: ['Morning', 'Sportage', 'Seltos', 'Carnival', 'K3'] },
    { brand: 'Ford', models: ['Ranger', 'Everest', 'Territory'] }
];

// Helper to get random item
const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper to generate JSONB content
const genContent = (lo: string, en: string) => ({ lo, en, ko: null, zh: null });

async function seed() {
    const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.SUPABASE_HOST || 'aws-1-ap-southeast-1.pooler.supabase.com',
        port: 6543,
        username: process.env.SUPABASE_DB_USER || 'postgres.htftpmuovlrzzvzuogii',
        password: process.env.SUPABASE_DB_PASSWORD || 'j761006',
        database: 'postgres',
        entities: [User, Category, Product, RealEstate, Job, Shop, Post, Car, CommonCode, Banner, AccessLog],
        synchronize: false,
        dropSchema: false,
    });

    await dataSource.initialize();
    console.log('Data Source has been initialized!');

    // Clear data
    try {
        await dataSource.query('TRUNCATE TABLE "user", "banner", "post", "job", "product", "real_estate", "shop", "car", "category", "common_code", "access_log" RESTART IDENTITY CASCADE;');
        console.log('Tables cleared.');
    } catch (e) {
        console.warn('Truncate failed (tables might be empty or missing logic?), proceeding...', e);
    }

    // 0. Create Common Codes (Keep existing logic but simplified for brevity)
    // ... (Skipping full CommonCode recreation for seed speed, usually static)

    // 1. Create Users
    console.log('Seeding Users...');
    const users: User[] = [];
    const mainAdmin = new User();
    mainAdmin.email = 'admin@laoslife.com';
    mainAdmin.password = '12341234';
    mainAdmin.nickname = 'SuperAdmin';
    mainAdmin.role = UserRole.ADMIN;
    mainAdmin.preferred_language = 'KO';
    users.push(mainAdmin);

    for (let i = 0; i < 20; i++) {
        const u = new User();
        u.email = faker.internet.email();
        u.password = 'password';
        u.nickname = faker.internet.username();
        u.role = UserRole.USER;
        u.preferred_language = getRandom(['LO', 'EN', 'KO']);
        users.push(u);
    }
    await dataSource.manager.save(users);

    const seller = users[1]; // Use first normal user as seller

    // 2. Create Banners
    console.log('Seeding Banners...');
    const banners = [
        { title: 'Grand Opening Sale', img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070' },
        { title: 'Find Your Dream Job', img: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070' },
        { title: 'Best Real Estate Deals', img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973' },
        { title: 'Delicious Food Delivery', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070' },
        { title: null, img: 'https://images.unsplash.com/photo-1593642532744-9365ef598194?q=80&w=2070' } // No title test
    ];

    const bannerEntities = banners.map((b, idx) => {
        const ban = new Banner();
        ban.title = b.title || ''; // Handle potential null if strict, but let's cast or allow null if entity calls for it. 
        if (b.title === null) ban.title = undefined as any; // Trick for optional
        ban.imageUrl = b.img;
        ban.sortOrder = idx;
        return ban;
    });
    await dataSource.manager.save(bannerEntities);


    // 3. Create Posts (Government News) - 100 items
    console.log('Seeding Posts...');
    const posts: Post[] = [];
    for (let i = 0; i < 100; i++) {
        const p = new Post();
        const loTitle = `ຂ່າວສານລັດຖະບານ ${(i + 1)}`;
        const enTitle = `Government News Update #${(i + 1)}`;
        p.title = genContent(loTitle, enTitle);

        const loContent = `ລາຍລະອຽດຂ່າວສານທີ່ສຳຄັນສຳລັບປະຊາຊົນ. ${faker.lorem.paragraph()}`;
        const enContent = `Important news details for citizens. ${faker.lorem.paragraph()}`;
        p.content = genContent(loContent, enContent);

        p.category = '정부소식';
        p.thumbnail = `https://picsum.photos/seed/post${i}/800/600`;
        p.attachments = [];
        posts.push(p);
    }
    await dataSource.manager.save(posts);

    // 4. Create Jobs - 100 items
    console.log('Seeding Jobs...');
    const jobs: Job[] = [];
    for (let i = 0; i < 100; i++) {
        const j = new Job();
        const role = faker.person.jobTitle();
        j.industry = faker.person.jobArea();

        j.title = genContent(`ຮັບສະໝັກ ${role}`, `Hiring: ${role}`);
        j.content = genContent(`ຕ້ອງການພະນັກງານດ່ວນ. ${faker.lorem.sentences(2)}`, `Urgent hiring. ${faker.lorem.sentences(2)}`);

        j.location = getRandom(LOCATIONS);
        j.salary = parseFloat(faker.commerce.price({ min: 200, max: 2000, dec: 0 })) * 10000; // Kip approx
        j.jobType = getRandom(['Full-time', 'Part-time']);
        j.experience = getRandom(['Entry Level', '1-3 Years', 'Senior']);
        j.contact = faker.phone.number();
        j.workingHours = 'Mon-Fri, 9AM - 6PM';
        j.thumbnail = `https://picsum.photos/seed/job${i}/200/200`; // Company logo
        jobs.push(j);
    }
    await dataSource.manager.save(jobs);

    // 5. Create Real Estate - 100 items
    console.log('Seeding Real Estate...');
    const realEstates: RealEstate[] = [];
    for (let i = 0; i < 100; i++) {
        const r = new RealEstate();
        const type = getRandom(['Apartment', 'House', 'Land']);
        const listing = i % 2 === 0 ? 'Rent' : 'Sale';

        r.location = genContent(`${getRandom(LOCATIONS)}`, `${getRandom(LOCATIONS)}`); // Simple for now
        r.propertyType = type;
        r.listingType = listing;
        r.price = getRandomInt(300, 5000); // USD
        r.bedrooms = getRandomInt(1, 6);
        r.bathrooms = getRandomInt(1, 4);
        r.area = getRandomInt(30, 500);
        r.description = genContent(`ເຮືອນງາມ ${type} ທີ່ ${r.location.lo}`, `Beautiful ${type} in ${r.location.en}. ${faker.lorem.sentences(2)}`);
        r.mapCoords = { lat: 17.97 + (Math.random() * 0.05), lng: 102.63 + (Math.random() * 0.05) }; // Vientiane range
        r.photos = [
            `https://picsum.photos/seed/re${i}a/800/600`,
            `https://picsum.photos/seed/re${i}b/800/600`
        ];
        realEstates.push(r);
    }
    await dataSource.manager.save(realEstates);

    // 6. Create Cars - 100 items
    console.log('Seeding Cars...');
    const cars: Car[] = [];
    for (let i = 0; i < 100; i++) {
        const carData = getRandom(CAR_MODELS);
        const model = getRandom(carData.models);
        const c = new Car();
        c.brand = carData.brand;
        c.model = model;
        c.year = getRandomInt(2010, 2024);
        c.price = getRandomInt(5000, 50000);
        c.mileage = getRandomInt(0, 150000);
        c.fuelType = getRandom(['Gasoline', 'Diesel', 'Electric']);
        c.transmission = getRandom(['Auto', 'Manual']);
        c.location = genContent(getRandom(LOCATIONS), getRandom(LOCATIONS));
        c.description = genContent(`ລົດສະພາບດີ ${model}`, `Good condition ${model}`);
        c.photos = [`https://picsum.photos/seed/car${i}/800/600`];
        c.color = faker.vehicle.color();
        c.contact = faker.phone.number();
        cars.push(c);
    }
    await dataSource.manager.save(cars);

    // 7. Create Products (Used Goods) - 100 items
    console.log('Seeding Products...');
    const products: Product[] = [];
    for (let i = 0; i < 100; i++) {
        const p = new Product();
        const name = faker.commerce.productName();
        p.title = genContent(name, name); // Faker doesn't support Lao well, using EN as placeholder for LO
        p.price = parseFloat(faker.commerce.price({ min: 10, max: 1000, dec: 0 }));
        p.description = genContent(faker.commerce.productDescription(), faker.commerce.productDescription());
        p.seller = seller;
        p.photos = [`https://picsum.photos/seed/prod${i}/600/600`];
        p.status = 'Available';
        p.condition = getRandom(['Used - Good', 'Used - Fair', 'New']);
        products.push(p);
    }
    await dataSource.manager.save(products);

    // 8. Create Shops (Restaurants/Services) - 100 items
    console.log('Seeding Shops...');
    const shops: Shop[] = [];
    for (let i = 0; i < 100; i++) {
        const s = new Shop();
        const food = getRandom(LAOS_FOODS);
        const name = `${food} Restaurant ${i}`;
        s.name = genContent(name, name);
        s.category = getRandom(['음식점', '설치/수리', '청소', '서비스']);
        s.subCategory = 'General';
        s.location = genContent(getRandom(LOCATIONS), getRandom(LOCATIONS));
        s.menuOrServices = genContent(`Special: ${food}`, `Specialty: ${food}`);
        s.phone = faker.phone.number();
        s.photos = [`https://picsum.photos/seed/shop${i}/600/400`];
        s.rating = getRandomInt(30, 50) / 10;
        shops.push(s);
    }
    await dataSource.manager.save(shops);

    console.log('Seeding complete!');
    await dataSource.destroy();
}

seed().catch((error) => console.log(error));
