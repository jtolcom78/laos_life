import { DataSource } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { Category, CategoryGroup } from '../entities/category.entity';
import { Product } from '../entities/product.entity';
import { RealEstate } from '../entities/real-estate.entity';
import { Job } from '../entities/job.entity';
import { Shop } from '../entities/shop.entity';
import { Post } from '../entities/post.entity';
import { Car } from '../entities/car.entity';
import { faker } from '@faker-js/faker';

async function seed() {
    const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'j761006',
        database: 'laos_life_db',
        entities: [User, Category, Product, RealEstate, Job, Shop, Post, Car],
        synchronize: true,
        dropSchema: true,
    });

    await dataSource.initialize();
    console.log('Data Source has been initialized!');

    // Clear existing data (Order matters due to FKs)
    await dataSource.query('TRUNCATE TABLE "post" CASCADE');
    await dataSource.query('TRUNCATE TABLE "shop" CASCADE');
    await dataSource.query('TRUNCATE TABLE "job" CASCADE');
    await dataSource.query('TRUNCATE TABLE "real_estate" CASCADE');
    await dataSource.query('TRUNCATE TABLE "product" CASCADE');
    await dataSource.query('TRUNCATE TABLE "car" CASCADE');
    await dataSource.query('TRUNCATE TABLE "category" CASCADE');
    await dataSource.query('TRUNCATE TABLE "user" CASCADE');

    // 1. Create Categories
    try {
        const categoryStructure = [
            {
                name: '중고거래', group: CategoryGroup.A, id: 'shopping',
                subs: ['디지털/가전', '가구/인테리어', '의류/잡화', '유아동', '생활용품', '식료품', '기타']
            },
            {
                name: '부동산', group: CategoryGroup.A, id: 'real_estate',
                subs: ['토지', '단독주택/빌라', '아파트/콘도', '상가/사무실', '공장/창고']
            },
            {
                name: '월세', group: CategoryGroup.A, id: 'rent',
                subs: ['아파트/콘도', '단독주택', '원룸/투룸', '상가/사무실', '헝태우']
            },
            {
                name: '중고차', group: CategoryGroup.A, id: 'used_car',
                subs: ['승용차', 'SUV/RV', '트럭/버스', '오토바이/스쿠터', '부품/용품']
            },
            {
                name: '취업', group: CategoryGroup.A, id: 'jobs',
                subs: ['전문직', '일반직', '아르바이트', '운전/배달', '생산/기술']
            },
            {
                name: '음식점', group: CategoryGroup.B, id: 'restaurants',
                subs: ['한식', '라오스식', '중식/일식', '양식/패스트푸드', '카페/디저트', '주점/호프']
            },
            {
                name: '설치/수리', group: CategoryGroup.B, id: 'repair',
                subs: ['에어컨', '세탁기', '침대', 'TV', '바닥', '전기', '인테리어', '자동차', '오토바이', '건축', '방충망', '간판/광고물/인쇄물', '컴퓨터', '가구', '주방', 'CCTV', '온수기', '인터넷', '휴대폰수리점']
            },
            {
                name: '청소', group: CategoryGroup.B, id: 'cleaning',
                subs: ['에어컨', '세탁기', '집', '하수도', '메트리스', '쇼파', '방역', '자동차/오토바이', '사무실']
            },
            {
                name: '서비스', group: CategoryGroup.B, id: 'services',
                subs: ['꽃', '이사/용달', '세탁서비스', '뷰티', '미용실', '부동산(월세)', '병원', '치과', '동물', '헬스장', '취미/학원', '빵집', '약국', '대행서비스', '렌트', '법무사', '변호사', '세무사', '이장', '여행사', '사진관', '안경점', '홈케어', '예식장', '파티/결혼식/장례', '복장대여', '맞춤옷', '예약 시스템', '마사지', '포장용품']
            },
            {
                name: '정부소식', group: CategoryGroup.C, id: 'news',
                subs: ['정책·법령·조치', '인프라·투자·개발', '보건·방역·안전', '관광·문화·행사', '외교·국제관계', '공공 캠페인', '인사·회의', '기타']
            },
        ];

        const categoryMap: Record<string, Category> = {};

        for (const catData of categoryStructure) {
            const mainCat = new Category();
            mainCat.name = catData.name;
            mainCat.group = catData.group;
            await dataSource.manager.save(mainCat);
            categoryMap[catData.name] = mainCat;

            for (const subName of catData.subs) {
                const subCat = new Category();
                subCat.name = subName;
                subCat.group = catData.group;
                subCat.parent = mainCat;
                await dataSource.manager.save(subCat);
            }
        }
        console.log('Categories created');
    } catch (e) { console.error('Error creating categories:', e); }

    // 2. Create Users (20 Users)
    const users: User[] = [];
    try {
        for (let i = 0; i < 20; i++) {
            const user = new User();
            user.email = faker.internet.email();
            user.password = 'password';
            user.nickname = faker.internet.username();
            user.phone = faker.phone.number();
            user.role = (i === 0 ? 'ADMIN' : 'USER') as any;
            users.push(user);
        }
        await dataSource.manager.save(users);
        console.log('Users created');
    } catch (e) { console.error('Error creating users:', e); }

    const seller1 = await dataSource.manager.findOne(User, { where: { email: users[0].email } });
    if (!seller1) throw new Error('Seller not found');

    // 3. Create Products (100 items)
    try {
        const products: Product[] = [];
        for (let i = 0; i < 100; i++) {
            const p = new Product();
            p.title = faker.commerce.productName();
            p.price = parseFloat(faker.commerce.price({ min: 50000, max: 5000000, dec: 0 }));
            p.description = faker.commerce.productDescription();
            p.photos = [faker.image.url(), faker.image.url()];
            p.seller = seller1;
            products.push(p);
        }
        await dataSource.manager.save(products);
        console.log('Products created');
    } catch (e) { console.error('Error creating products:', e); }

    // 4. Create Real Estate (100 items)
    try {
        const realEstates: RealEstate[] = [];
        for (let i = 0; i < 100; i++) {
            const re = new RealEstate();
            re.location = faker.location.streetAddress();
            const isRent = i % 2 === 0;
            re.price = parseFloat(faker.commerce.price({
                min: isRent ? 1000000 : 500000000,
                max: isRent ? 20000000 : 5000000000,
                dec: 0
            }));
            re.roomCount = faker.number.int({ min: 1, max: 5 });
            re.photos = [faker.image.url(), faker.image.url()];
            re.mapCoords = { lat: faker.location.latitude(), lng: faker.location.longitude() };
            re.listingType = isRent ? 'Rent' : 'Sale';
            re.propertyType = faker.helpers.arrayElement(['Apartment', 'House', 'Land']);
            re.bedrooms = faker.number.int({ min: 1, max: 5 });
            re.bathrooms = faker.number.int({ min: 1, max: 3 });
            re.area = faker.number.int({ min: 30, max: 200 });
            realEstates.push(re);
        }
        await dataSource.manager.save(realEstates);
        console.log('Real Estates created');
    } catch (e) { console.error('Error creating real estate:', e); }

    // 5. Create Shops (100 items)
    try {
        const shops: Shop[] = [];
        for (let i = 0; i < 100; i++) {
            const s = new Shop();
            s.name = faker.company.name();
            s.category = faker.helpers.arrayElement(['음식점', '설치/수리', '청소', '서비스']);
            s.subCategory = faker.helpers.arrayElement(['한식', '에어컨', '이사/용달']);
            s.location = faker.location.streetAddress();
            s.menuOrServices = faker.lorem.paragraph();
            s.phone = faker.phone.number();
            s.photos = [faker.image.url()];
            s.rating = faker.number.float({ min: 1, max: 5, fractionDigits: 1 });
            shops.push(s);
        }
        await dataSource.manager.save(shops);
        console.log('Shops created');
    } catch (e) { console.error('Error creating shops:', e); }

    // 6. Create Jobs (100 items)
    try {
        const jobs: Job[] = [];
        for (let i = 0; i < 100; i++) {
            const j = new Job();
            j.industry = faker.person.jobArea();
            j.salary = parseFloat(faker.commerce.price({ min: 2000000, max: 15000000, dec: 0 }));
            j.workingHours = '9AM - 6PM';
            j.contact = faker.phone.number();
            j.jobType = faker.helpers.arrayElement(['Full-time', 'Part-time']);
            j.experience = faker.helpers.arrayElement(['Junior', 'Senior', 'Manager']);
            jobs.push(j);
        }
        await dataSource.manager.save(jobs);
        console.log('Jobs created');
    } catch (e) { console.error('Error creating jobs:', e); }

    // 7. Create Posts (100 items)
    try {
        const posts: Post[] = [];
        for (let i = 0; i < 100; i++) {
            const p = new Post();
            p.title = faker.lorem.sentence();
            p.content = faker.lorem.paragraphs(2);
            p.category = '정부소식';
            p.thumbnail = faker.image.url();
            posts.push(p);
        }
        await dataSource.manager.save(posts);
        console.log('Posts created');
    } catch (e) { console.error('Error creating posts:', e); }

    // 8. Create Cars (100 items)
    try {
        const cars: Car[] = [];
        for (let i = 0; i < 100; i++) {
            const c = new Car();
            c.brand = faker.vehicle.manufacturer();
            c.model = faker.vehicle.model();
            c.year = faker.date.past().getFullYear();
            c.price = parseFloat(faker.commerce.price({ min: 50000000, max: 800000000, dec: 0 }));
            c.mileage = faker.number.int({ min: 10000, max: 200000 });
            c.fuelType = faker.vehicle.fuel();
            c.transmission = faker.helpers.arrayElement(['Automatic', 'Manual']);
            c.color = faker.vehicle.color();
            c.location = faker.location.city();
            c.photos = [faker.image.url()];
            cars.push(c);
        }
        await dataSource.manager.save(cars);
        console.log('Cars created');
    } catch (e) { console.error('Error creating cars:', e); }

    console.log('Seeding complete!');
    await dataSource.destroy();
}

seed().catch((error) => console.log(error));
