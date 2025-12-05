'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            dashboard: "Dashboard",
            user_management: "User Management",
            content_management: "Content Management",
            total_users: "Total Users",
            active_listings: "Active Listings",
            new_reports: "New Reports",
            welcome_admin: "Welcome, Admin",
            logout: "Logout",
            create_new: "Create New",
            title: "Title",
            category: "Category",
            created_at: "Created At",
            actions: "Actions",
            edit: "Edit",
            delete: "Delete",
            save: "Save",
            cancel: "Cancel"
        }
    },
    ko: {
        translation: {
            dashboard: "대시보드",
            user_management: "사용자 관리",
            content_management: "콘텐츠 관리",
            total_users: "총 회원 수",
            active_listings: "등록된 매물",
            new_reports: "신고 접수",
            welcome_admin: "관리자님 환영합니다",
            logout: "로그아웃",
            create_new: "새로 만들기",
            title: "제목",
            category: "카테고리",
            created_at: "작성일",
            actions: "관리",
            edit: "수정",
            delete: "삭제",
            save: "저장",
            cancel: "취소"
        }
    },
    lo: {
        translation: {
            dashboard: "ແຜງຄວບຄຸມ",
            user_management: "ການຈັດການຜູ້ໃຊ້",
            content_management: "ການຈັດການເນື້ອຫາ",
            total_users: "ຜູ້ໃຊ້ທັງໝົດ",
            active_listings: "ລາຍການທີ່ເຄື່ອນໄຫວ",
            new_reports: "ລາຍງານໃໝ່",
            welcome_admin: "ຍິນດີຕ້ອນຮັບ, ຜູ້ເບິ່ງແຍງລະບົບ",
            logout: "ອອກຈາກລະບົບ",
            create_new: "ສ້າງໃໝ່",
            title: "ຫົວຂໍ້",
            category: "ປະເພດ",
            created_at: "ວັນທີສ້າງ",
            actions: "ການກະທຳ",
            edit: "ແກ້ໄຂ",
            delete: "ລຶບ",
            save: "ບັນທຶກ",
            cancel: "ຍົກເລີກ"
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'ko', // Default to Korean for Admin
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
