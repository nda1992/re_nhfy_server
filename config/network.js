const path = require('path')
    // 服务器地址的配置（用于用户图片、文件的上传和下载）
    // 基地址
const BASE_URL = 'http://localhost:3000/'

// 客户端上传
// 管理员头像上传
const ADMIN_AVATAR_URL_UPLOAD = path.join(__dirname, '../public/images/avatar/')

// 新闻图片上传
const NEWS_IMAGES_URL_UPLOAD = path.join(__dirname, '../public/images/news/')

// 新闻附件上传
const NEWS_ATTACHMENTFILE_URL_UPLOAD = path.join(__dirname, '../public/files/')

// 求职者头像上传
const JOBSEEKER_AVATAR_URL_UPLOAD = path.join(__dirname, '../public/jobseekersAvatar/')

// 求职者简历上传
const JOBSEEKER_RESUME_URL_UPLOAD = path.join(__dirname, '../public/jobseekersFiles/')

// 轮播图片上传
const SWIPER_IMAGES_URL_UPLOAD = path.join(__dirname, '../public/swipers/')

// 官网视频上传
const WEBSITE_VIDEO_UPLOAD = path.join(__dirname, '../public/websiteVideos/')

// 视频封面上传
const VIDEO_COVER_UPLOAD = path.join(__dirname, '../public/websiteVideos/cover/')

// 客户端下载

// 管理员默认头像地址
const ADMIN_DEFAULT_AVATAR_URL_DOWNLOAD = 'http://localhost:3000/images/avatar/defaultImg.png'

// 管理员头像下载
const ADMIN_AVATAR_URL_DOWNLOAD = 'http://localhost:3000/images/avatar/'

// 新闻图片下载
const NEWS_IMAGES_URL_DOWNLOAD = 'http://localhost:3000/images/news/'

// 新闻附件下载
const NEWS_ATTACHMENTFILE_URL_DOWNLOAD = 'http://localhost:3000/files/'

// 求职者头像下载
const JOBSEEKER_AVATAR_URL_DOWNLOAD = 'http://localhost:3000/jobseekersAvatar/'

// 求职者简历下载
const JOBSEEKER_RESUME_URL_DOWNLOAD = 'http://localhost:3000/jobseekersFiles/'

// 求职者默认头像地址
const JOBSEEKER_DEFAULT_AVATAR_URL_DOWNLOAD = 'http://localhost:3000/jobseekersAvatar/default.jpg'

// 轮播图片下载
const SWIPER_IMAGES_URL_DOWNLOAD = 'http://localhost:3000/swipers/'

// 视频下载
const WEBSITE_VIDEO_DOWNLOAD = 'http://localhost:3000/websiteVideos/'

// 视频封面下载
const VIDEO_COVER_DOWNLOAD = 'http://localhost:3000/websiteVideos/cover/'

module.exports = {
    BASE_URL,
    ADMIN_AVATAR_URL_UPLOAD,
    NEWS_IMAGES_URL_UPLOAD,
    NEWS_ATTACHMENTFILE_URL_UPLOAD,
    JOBSEEKER_AVATAR_URL_UPLOAD,
    JOBSEEKER_RESUME_URL_UPLOAD,
    SWIPER_IMAGES_URL_UPLOAD,
    WEBSITE_VIDEO_UPLOAD,
    VIDEO_COVER_UPLOAD,
    ADMIN_AVATAR_URL_DOWNLOAD,
    NEWS_IMAGES_URL_DOWNLOAD,
    NEWS_ATTACHMENTFILE_URL_DOWNLOAD,
    JOBSEEKER_AVATAR_URL_DOWNLOAD,
    JOBSEEKER_RESUME_URL_DOWNLOAD,
    SWIPER_IMAGES_URL_DOWNLOAD,
    JOBSEEKER_DEFAULT_AVATAR_URL_DOWNLOAD,
    ADMIN_DEFAULT_AVATAR_URL_DOWNLOAD,
    WEBSITE_VIDEO_DOWNLOAD,
    VIDEO_COVER_DOWNLOAD
}