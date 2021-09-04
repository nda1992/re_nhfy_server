/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50732
 Source Host           : localhost:3306
 Source Schema         : re_nhfy

 Target Server Type    : MySQL
 Target Server Version : 50732
 File Encoding         : 65001

 Date: 04/09/2021 22:10:59
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for advice
-- ----------------------------
DROP TABLE IF EXISTS `advice`;
CREATE TABLE `advice`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userCode` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `content` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of advice
-- ----------------------------

-- ----------------------------
-- Table structure for avatars
-- ----------------------------
DROP TABLE IF EXISTS `avatars`;
CREATE TABLE `avatars`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userCode` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `url` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of avatars
-- ----------------------------
INSERT INTO `avatars` VALUES (2, '10529', 'http://localhost:3000/images/avatar/df2417cd-5a9e-433e-86fa-447d14d6b553.jpg', '2021-08-14 03:09:02', '2021-08-27 22:18:28');
INSERT INTO `avatars` VALUES (3, '01258', 'http://localhost:3000/images/avatar/a130c354-cfac-4759-864a-c855f18ea876.png', '2021-08-14 03:21:53', '2021-08-14 03:34:50');

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of categories
-- ----------------------------
INSERT INTO `categories` VALUES (1, '医院动态', '2021-08-21 04:17:55', '2021-08-21 04:17:55', '农丁安');
INSERT INTO `categories` VALUES (2, '媒体聚焦', '2021-08-21 04:19:07', '2021-08-21 04:19:07', '农丁安');
INSERT INTO `categories` VALUES (3, '通知公告', '2021-08-21 04:22:50', '2021-08-21 04:22:50', '农丁安');
INSERT INTO `categories` VALUES (4, '科室动态', '2021-08-21 04:23:02', '2021-08-21 04:23:02', '农丁安');
INSERT INTO `categories` VALUES (5, '院情通报', '2021-08-21 04:23:39', '2021-08-21 04:23:39', '农丁安');
INSERT INTO `categories` VALUES (6, '患者飞鸿', '2021-08-21 04:23:46', '2021-08-21 04:23:46', '农丁安');
INSERT INTO `categories` VALUES (7, '文化建设', '2021-08-21 04:23:55', '2021-08-21 04:23:55', '农丁安');
INSERT INTO `categories` VALUES (8, '招聘信息', '2021-08-27 22:19:43', '2021-08-27 22:19:43', '农丁安');

-- ----------------------------
-- Table structure for depts
-- ----------------------------
DROP TABLE IF EXISTS `depts`;
CREATE TABLE `depts`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `deptName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `deptCode` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `deptAddr` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `deleteBit` int(11) NULL DEFAULT NULL,
  `deptLeader` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `desc` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `level` int(3) NULL DEFAULT NULL COMMENT '部门级别',
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 21 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of depts
-- ----------------------------
INSERT INTO `depts` VALUES (3, '院务工作部', '101', '综合楼722', 1, '张三', '医院综合协调管理部门，院务工作部本部负责印章管理、会议室安排、餐票发放等工作，下辖三个二级部门：法制办公室、招投标中心、数据中心', 1, '2021-08-14 07:52:04', '2021-08-14 07:52:04');
INSERT INTO `depts` VALUES (4, '党务工作部', '102', '综合楼726', 1, '李四', '负责医院的党建工作', 1, '2021-08-14 07:56:50', '2021-08-15 05:38:42');
INSERT INTO `depts` VALUES (5, '数据中心', '1012', '综合楼715', 1, '钱七', '负责全院的数据管理和数据分析工作', 2, '2021-08-14 08:18:52', '2021-08-15 05:42:56');
INSERT INTO `depts` VALUES (7, '人力资源部', '103', '综合楼602', 1, '赵六', '负责全院的人事工作', 1, '2021-08-15 04:55:28', '2021-08-15 04:55:28');
INSERT INTO `depts` VALUES (10, '教育培训部', '104', '综合楼612', 1, '张珊珊', '负责全院的教育、培训相关工作', 1, '2021-08-15 06:01:04', '2021-08-15 06:01:04');
INSERT INTO `depts` VALUES (11, '科研部', '105', '综合楼607', 1, '李磊', '负责全院的科研工作', 1, '2021-08-15 06:01:45', '2021-08-15 08:50:04');
INSERT INTO `depts` VALUES (14, '规划建设科', '106', '综合楼622', 1, '王五', '负责全院的工程招标和建设工作', 1, '2021-08-24 21:24:04', '2021-08-24 21:25:22');
INSERT INTO `depts` VALUES (15, '医务部', '107', '综合楼507', 1, '李明', '负责全院的全面性工作', 1, '2021-08-24 21:25:06', '2021-08-24 21:25:06');
INSERT INTO `depts` VALUES (16, '财务部', '108', '综合楼525', 1, '刘明', '负责全院的财务和预算等工作', 1, '2021-08-24 21:26:38', '2021-08-24 21:26:38');
INSERT INTO `depts` VALUES (17, '监察室', '109', '综合楼722', 1, '王东', '负责全院的监察工作', 1, '2021-08-24 21:42:52', '2021-08-24 21:42:52');
INSERT INTO `depts` VALUES (18, '全质办', '110', '综合楼614', 1, '赵磊', '负责全院的质量管理工作', 1, '2021-08-24 21:45:33', '2021-08-24 21:45:33');
INSERT INTO `depts` VALUES (19, '保卫科', '111', '综合楼502', 1, '张宇', '负责全院的安全保卫工作', 1, '2021-08-24 21:47:01', '2021-08-24 21:47:01');
INSERT INTO `depts` VALUES (20, '院领导', '112', '综合楼723', 1, '张明', '院领导', 1, '2021-08-24 21:47:47', '2021-08-24 21:47:47');

-- ----------------------------
-- Table structure for jobseekers
-- ----------------------------
DROP TABLE IF EXISTS `jobseekers`;
CREATE TABLE `jobseekers`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `openid` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `faceimgUrl` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `phone` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `sex` int(11) NULL DEFAULT NULL,
  `age` int(11) NULL DEFAULT NULL,
  `birthday` datetime(0) NULL DEFAULT NULL,
  `nation` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `address` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `degree` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `school` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `professional` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `undergraduateTime` datetime(0) NULL DEFAULT NULL,
  `attachmentUrl` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `loginNum` int(11) NULL DEFAULT NULL COMMENT '登录次数',
  `role` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户角色，为jobseeker',
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of jobseekers
-- ----------------------------
INSERT INTO `jobseekers` VALUES (1, 'adbifdaboigbaf$#daf', '李四', '$2b$10$vgKUBSmSbupyhWvsxIDIFO3L.S9NxOiCF3JU6/yuLXmzjHc0li/9m', 'http://localhost:3000/jobseekersAvatar/default.jpg', '13585859696', 'zhangsan@126.com', 1, 23, '1998-05-26 08:00:00', '汉族', '北京市海淀区', '硕士研究生', '北京大学', '内科学', '2021-07-01 08:00:00', 'http:/localhost:3000/files/resume.pdf', 3, 'jobseeker', '2021-08-28 21:33:40', '2021-09-04 15:34:37');
INSERT INTO `jobseekers` VALUES (3, NULL, '张三', '$2b$10$NqNpk4uWip7PdE2y7ZKEa.hyOgzqG/fYHavkHRbvjInA1qM8x2UJm', 'http://localhost:3000/jobseekersAvatar/default.jpg', '13585859695', '1146952400@qq.com', NULL, NULL, NULL, NULL, NULL, NULL, '中山大学', '外科学', NULL, NULL, 74, 'jobseeker', '2021-08-29 22:08:11', '2021-09-04 21:36:54');

-- ----------------------------
-- Table structure for news
-- ----------------------------
DROP TABLE IF EXISTS `news`;
CREATE TABLE `news`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `content` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `userName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `deptName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `createTime` datetime(0) NULL DEFAULT NULL,
  `category` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `newsStatus` int(11) NULL DEFAULT NULL,
  `type` int(11) NULL DEFAULT NULL,
  `clickNum` int(11) NULL DEFAULT NULL,
  `plateform` int(11) NULL DEFAULT NULL,
  `loginuserCode` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '当前登录的用户名',
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 33 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of news
-- ----------------------------
INSERT INTO `news` VALUES (17, '新闻标题123456', '<p>123456</p>', '张三', '院务工作部', '2021-08-22 11:12:33', '通知公告', 'published', 1, 2, 0, 1, '10529', '2021-08-21 21:13:36', '2021-08-22 12:13:37');
INSERT INTO `news` VALUES (20, '南华附一医院表彰“两优一先” ：党建引领医院高质量发展', '<p><strong><span class=\"16\"><span style=\"font-family: 微软雅黑;\">红网时刻衡阳</span><span style=\"font-family: 微软雅黑;\">6月29日讯</span></span></strong><span style=\"font-family: 微软雅黑;\">（记者</span>&nbsp;<span style=\"font-family: 微软雅黑;\">谭倩）</span></p>\n<p><span style=\"font-family: 微软雅黑;\">&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;6月29日晚，南华大学附属第一医院举行庆祝建党100周年暨七一表彰大会，对该院年度优秀党员、优秀党务工作者和优秀党支部进行表彰，并为老党员代表颁发&ldquo;光荣在党50年&rdquo;纪念章，激励全体党员干部以老党员、先进典型为榜样，坚持党的领导，在波澜壮阔的新征程中作出新贡献.</span></p>\n<p><span style=\"font-family: 微软雅黑;\"><img class=\"wscnph\" style=\"display: block; margin-left: auto; margin-right: auto;\" src=\"http://localhost:3000/images/news/fd4ad4dc-faa3-4fa2-8b39-8ecbd9a90d92.jpg\" width=\"500\" /></span></p>\n<p><span style=\"font-family: 微软雅黑;\">&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;创办于战火纷飞的抗战年代，成长于改革开放波澜壮阔的伟大实践，发展于中华民族走向伟大复兴、努力实现中国梦的光辉时代。78年来，南华大学附属第一医院坚定不移加强党的领导，走出了一条跨越式、高质量发展的新路子&mdash;&mdash;医疗服务能力迅速提升，学科建设突飞猛进，人才培养特色鲜明，科研成果硕果累累，社会服务成绩显著。</span></p>\n<p><span style=\"font-family: 微软雅黑;\"><img class=\"wscnph\" style=\"display: block; margin-left: auto; margin-right: auto;\" src=\"http://localhost:3000/images/news/bfb7b3d5-910d-4743-9352-b8b695c8a7e7.jpg\" width=\"500\" /></span></p>', '张三', '党务工作部', '2021-08-21 22:00:07', '医院动态', 'published', 2, 2, 0, 1, '10529', '2021-08-21 22:02:01', '2021-08-21 22:02:01');
INSERT INTO `news` VALUES (21, '今天是个好日子', '<p>今天是个好日子</p>', '刘航', '院务工作部', '2021-08-22 15:56:49', '医院动态', 'published', 2, 2, 0, 1, '10529', '2021-08-22 12:15:52', '2021-08-24 23:14:20');
INSERT INTO `news` VALUES (22, 'vue是个好工具', '<p>vue是个好工具123</p>', '张磊', '人力资源部', '2021-08-22 12:16:24', '通知公告', 'published', 2, 2, 0, 1, '10529', '2021-08-22 12:16:51', '2021-08-24 22:43:59');
INSERT INTO `news` VALUES (26, '当然，React也是一个好工具', '<p>123456</p>', '张三', '院务工作部', '2021-08-22 21:58:25', '通知公告', 'published', 2, 2, 0, 1, '10529', '2021-08-22 17:36:43', '2021-08-24 22:43:24');
INSERT INTO `news` VALUES (27, '这个up主很有意思', '', '张磊', '数据中心', '2021-08-22 21:59:06', '院情通报', 'draft', 4, 1, 2, 1, '10529', '2021-08-22 21:59:40', '2021-08-24 23:12:37');
INSERT INTO `news` VALUES (29, 'ES6常用知识点', '<p>ES6的知识点很多，常用的主要有以下的一些技巧和方法.</p>\n<p><img class=\"wscnph\" src=\"http://localhost:3000/images/news/a6c70741-190e-423b-8013-9bc9964d70d6.png\" width=\"500\" /></p>\n<p>&nbsp;</p>', '张磊', '数据中心', '2021-08-22 22:08:19', '医院动态', 'published', 1, 2, 0, 1, '10529', '2021-08-22 22:14:58', '2021-08-26 21:20:37');
INSERT INTO `news` VALUES (30, '坚持全面从严治党 深入推进“清廉医院”建设——南华大学派驻附属医院纪检监察组正式进驻我院', '<p><span style=\"font-family: 微软雅黑;\">&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;为深入推进附属医院全面从严治党、党风廉政建设和反腐败工作，</span><span style=\"font-family: 微软雅黑;\">7月16日下午，南华大学派驻附属医院纪检监察组进驻工作会议在医院综合楼八楼会议厅召开。校纪委副书记、监察处处长、派驻附属医院纪检监察组</span><span style=\"font-family: 微软雅黑;\">组长</span><span style=\"font-family: 微软雅黑;\">曾建新出席会议并讲话。医院副院长李志高主持会议。<br /></span></p>\n<p>&nbsp;</p>\n<p><span style=\"font-family: 微软雅黑;\"><img class=\"wscnph\" style=\"display: block; margin-left: auto; margin-right: auto;\" src=\"http://localhost:3000/images/news/3094b0d5-8073-4e2d-9ddd-fb62315fa61f.png\" width=\"500\" /></span></p>\n<p>&nbsp;</p>\n<p><span style=\"font-family: 微软雅黑;\">&nbsp; &nbsp; &nbsp;&nbsp;&nbsp;会上，院纪委书记宁曼荣代表医院纪委表态：坚定使命担当，充分发挥纪检监察监督保障执行、促进完善发展的作用；加强与派驻组的沟通与联系，破解医院重点领域、关键问题的监督难题；牢固树立服务意识，扎实做好派驻纪检监察组的保障工作。</span></p>\n<p><span style=\"font-family: 微软雅黑;\">&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;院党委书记刘江华代表医院党委表态：坚决提高站位，充分认识纪检监察派驻制的重要意义；正确对待监督，全力支持配合派驻组开展工作；即时建立台账，确保整改工作不留盲区、不留死角。</span></p>\n<p><span style=\"font-family: 微软雅黑;\">&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;派驻附属医院纪检监察组副组长汪胜春代表派驻组全体成员表态：牢记初心使命，贯彻落实校党委决策部署；积极主动作为，提升派驻工作实效；严守纪律规矩，做到自身清正廉洁。</span></p>\n<p><span style=\"font-family: 微软雅黑;\">&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;曾建新受校纪委书记刘杏花委托作了讲话。他指出，派驻附属医院纪检监察组正式移驻附一医院，是校党委关于派驻工作的统筹安排，是以附一医院为驻点&ldquo;根据地&rdquo;对学校6所附属医院履行派驻监督责任，是推动、协助和帮助附属医院做好全面从严治党、党风廉政建设和反腐败工作。他强调，一是医院要深刻领悟校党委、校纪委对附属医院派驻监督的意义和作用；二是医院要积极支持、配合派驻组工作，认真履职尽责，扛好&ldquo;两个责任&rdquo;，建设正气充盈的廉洁医院；三是派驻组要恪尽职守，担当作为，发挥好&ldquo;前哨&rdquo;、&ldquo;探头&rdquo;作用，切实作为促进医院全面从严治党、推进医院高质量发展的有力助手。</span></p>\n<p><span style=\"font-family: 微软雅黑;\"><a style=\"text-decoration: none;\" href=\"http://localhost:3000/files/3bc6ed95-c00a-40ed-8750-3bc9cae2993d.docx\">述职报告.docx</a><br /></span></p>', '张三', '党务工作部', '2021-08-24 20:41:50', '医院动态', 'published', 1, 2, 2, 1, '10529', '2021-08-24 20:51:08', '2021-08-24 23:15:10');
INSERT INTO `news` VALUES (31, '坚持全面从严治党 深入推进“清廉医院”建设——南华大学派驻附属医院纪检监察组正式进驻我院', '<p><span style=\"font-family: 微软雅黑;\">&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;为深入推进附属医院全面从严治党、党风廉政建设和反腐败工作，</span><span style=\"font-family: 微软雅黑;\">7月16日下午，南华大学派驻附属医院纪检监察组进驻工作会议在医院综合楼八楼会议厅召开。校纪委副书记、监察处处长、派驻附属医院纪检监察组</span><span style=\"font-family: 微软雅黑;\">组长</span><span style=\"font-family: 微软雅黑;\">曾建新出席会议并讲话。医院副院长李志高主持会议。<br /></span></p>\n<p>&nbsp;</p>\n<p><span style=\"font-family: 微软雅黑;\"><img class=\"wscnph\" style=\"display: block; margin-left: auto; margin-right: auto;\" src=\"http://localhost:3000/images/news/3094b0d5-8073-4e2d-9ddd-fb62315fa61f.png\" width=\"500\" /></span></p>\n<p>&nbsp;</p>\n<p><span style=\"font-family: 微软雅黑;\">&nbsp; &nbsp; &nbsp;&nbsp;&nbsp;会上，院纪委书记宁曼荣代表医院纪委表态：坚定使命担当，充分发挥纪检监察监督保障执行、促进完善发展的作用；加强与派驻组的沟通与联系，破解医院重点领域、关键问题的监督难题；牢固树立服务意识，扎实做好派驻纪检监察组的保障工作。</span></p>\n<p><span style=\"font-family: 微软雅黑;\">&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;院党委书记刘江华代表医院党委表态：坚决提高站位，充分认识纪检监察派驻制的重要意义；正确对待监督，全力支持配合派驻组开展工作；即时建立台账，确保整改工作不留盲区、不留死角。</span></p>\n<p><span style=\"font-family: 微软雅黑;\">&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;派驻附属医院纪检监察组副组长汪胜春代表派驻组全体成员表态：牢记初心使命，贯彻落实校党委决策部署；积极主动作为，提升派驻工作实效；严守纪律规矩，做到自身清正廉洁。</span></p>\n<p><span style=\"font-family: 微软雅黑;\">&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;曾建新受校纪委书记刘杏花委托作了讲话。他指出，派驻附属医院纪检监察组正式移驻附一医院，是校党委关于派驻工作的统筹安排，是以附一医院为驻点&ldquo;根据地&rdquo;对学校6所附属医院履行派驻监督责任，是推动、协助和帮助附属医院做好全面从严治党、党风廉政建设和反腐败工作。他强调，一是医院要深刻领悟校党委、校纪委对附属医院派驻监督的意义和作用；二是医院要积极支持、配合派驻组工作，认真履职尽责，扛好&ldquo;两个责任&rdquo;，建设正气充盈的廉洁医院；三是派驻组要恪尽职守，担当作为，发挥好&ldquo;前哨&rdquo;、&ldquo;探头&rdquo;作用，切实作为促进医院全面从严治党、推进医院高质量发展的有力助手。</span></p>\n<p><span style=\"font-family: 微软雅黑;\"><a style=\"text-decoration: none;\" href=\"http://localhost:3000/files/3bc6ed95-c00a-40ed-8750-3bc9cae2993d.docx\">述职报告.docx</a><br /></span></p>', '张三', '党务工作部', '2021-08-24 20:41:50', '医院动态', 'draft', 4, 1, 2, 1, '10529', '2021-08-24 20:51:15', '2021-08-26 20:01:45');
INSERT INTO `news` VALUES (32, '今天是个好日子', '<p>今天是个好日子</p>', '刘航', '院务工作部', '2021-08-22 15:56:49', '医院动态', 'draft', 4, 1, 0, 1, '10529', '2021-08-24 23:14:52', '2021-08-24 23:14:52');

-- ----------------------------
-- Table structure for positions
-- ----------------------------
DROP TABLE IF EXISTS `positions`;
CREATE TABLE `positions`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `positionName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `deptName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `requireNum` int(11) NULL DEFAULT NULL,
  `type` int(11) NULL DEFAULT NULL,
  `userCode` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `age` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `degree` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `english` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `professional` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '专业要求',
  `Handlestatus` int(11) NULL DEFAULT NULL,
  `status` int(11) NULL DEFAULT NULL,
  `desc` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of positions
-- ----------------------------
INSERT INTO `positions` VALUES (1, '医师', '人力资源部', '南华大学附属第一医院', 2, 1, '10529', '32岁以下', '研究生及以上', '英语六级', '内科学', 2, 1, '医师', '2021-08-28 15:34:51', '2021-08-28 17:31:32');
INSERT INTO `positions` VALUES (3, '医师', '院务工作部', '南华大学附属第一医院', 3, 1, '10263', '30岁及以下', '硕士研究生及以上', '英语四级', '神经外科', 2, 1, '医师', '2021-08-28 16:45:18', '2021-08-28 17:54:29');
INSERT INTO `positions` VALUES (4, '副主任医师', '党务工作部', '综合楼517', 1, 2, '12356', '32岁及以下', '硕士研究生及以上', '英语六级', '耳鼻喉科', 2, 1, '副主任医师', '2021-08-28 17:55:29', '2021-08-28 18:03:55');
INSERT INTO `positions` VALUES (5, '技师', '教育培训部', '综合楼612', 1, 2, '10529', '32岁及以下', '硕士研究生及以上', '英语六级', '中医科', 2, 1, '教育培训部岗位', '2021-08-28 20:44:16', '2021-08-30 21:08:01');
INSERT INTO `positions` VALUES (6, '管理', '院务工作部', '综合楼722', 1, 2, '10529', '30岁及以下', '硕士研究生及以上', '英语六级', '计算机相关专业', 1, 2, '法学专业', '2021-08-28 20:47:04', '2021-09-02 23:01:08');
INSERT INTO `positions` VALUES (7, '技师', '科研部', '综合楼608', 1, 2, '10529', '32岁及以下', '硕士研究生及以上', '英语四级', '临床医学', 2, 1, '临床医学', '2021-08-28 21:49:07', '2021-08-30 21:07:35');
INSERT INTO `positions` VALUES (8, '临床心理医学科医师', '医务部', '综合楼513', 2, 1, '10529', '32岁及以下', '博士', '英语六级', '临床心理医学科', 2, 1, '临床心理医学科', '2021-08-28 21:51:14', '2021-08-30 21:07:37');
INSERT INTO `positions` VALUES (9, '医师', '财务部', '综合楼526', 1, 1, '10529', '35岁及以下', '博士', '英语六级', '病理学', 2, 1, '病理学', '2021-08-28 21:52:14', '2021-08-30 21:07:30');
INSERT INTO `positions` VALUES (10, '医疗美容科技师', '财务部', '综合楼532', 2, 2, '10529', '32岁及以下', '硕士研究生及以上', '英语四级', '医疗美容科技师', 2, 1, '医疗美容科技师', '2021-08-28 21:53:00', '2021-08-30 21:07:28');
INSERT INTO `positions` VALUES (11, '门诊口腔科', '规划建设科', '综合楼622', 1, 1, '10529', '32岁及以下', '博士', '英语六级', '门诊口腔科', 2, 1, '门诊口腔科', '2021-08-28 21:53:59', '2021-08-30 21:08:48');
INSERT INTO `positions` VALUES (12, '眼科医师', '数据中心', '综合楼804', 1, 1, '10529', '35岁及以下', '博士', '英语六级', '门诊眼科', 2, 1, '门诊眼科', '2021-08-28 21:55:00', '2021-08-30 21:07:43');
INSERT INTO `positions` VALUES (13, '内分泌代谢科', '人力资源部', '南华大学附属第一医院', 1, 1, '10529', '35岁及以下', '博士', '英语六级', '内分泌代谢科相关专业', 2, 1, '需要有三年的工作经验', '2021-08-30 21:07:04', '2021-08-30 21:07:41');

-- ----------------------------
-- Table structure for post2positions
-- ----------------------------
DROP TABLE IF EXISTS `post2positions`;
CREATE TABLE `post2positions`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status` int(11) NULL DEFAULT NULL,
  `isPosted` int(2) NULL DEFAULT NULL,
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  `jobSeekerId` int(11) NULL DEFAULT NULL,
  `PositionId` int(11) NULL DEFAULT NULL,
  `confirm` int(2) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `post2positions_PositionId_jobSeekerId_unique`(`jobSeekerId`, `PositionId`) USING BTREE,
  INDEX `PositionId`(`PositionId`) USING BTREE,
  CONSTRAINT `post2positions_ibfk_1` FOREIGN KEY (`jobSeekerId`) REFERENCES `jobseekers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `post2positions_ibfk_2` FOREIGN KEY (`PositionId`) REFERENCES `positions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of post2positions
-- ----------------------------
INSERT INTO `post2positions` VALUES (2, 1, 1, '2021-09-01 22:22:10', '2021-09-01 22:22:10', 3, 6, 0);
INSERT INTO `post2positions` VALUES (4, 2, 1, '2021-09-02 22:14:52', '2021-09-04 15:14:37', 3, 8, 0);
INSERT INTO `post2positions` VALUES (5, 3, 1, '2021-09-02 23:16:53', '2021-09-04 16:48:36', 3, 11, 0);
INSERT INTO `post2positions` VALUES (6, 4, 1, '2021-09-04 15:35:22', '2021-09-04 15:42:43', 1, 4, 1);
INSERT INTO `post2positions` VALUES (7, 4, 1, '2021-09-04 15:51:23', '2021-09-04 16:50:58', 1, 8, 1);
INSERT INTO `post2positions` VALUES (8, 1, 1, '2021-09-04 21:36:38', '2021-09-04 21:36:38', 1, 3, 0);

-- ----------------------------
-- Table structure for sequelizemeta
-- ----------------------------
DROP TABLE IF EXISTS `sequelizemeta`;
CREATE TABLE `sequelizemeta`  (
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`name`) USING BTREE,
  UNIQUE INDEX `name`(`name`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sequelizemeta
-- ----------------------------
INSERT INTO `sequelizemeta` VALUES ('20210808111930-create-user.js');
INSERT INTO `sequelizemeta` VALUES ('20210810142735-create-token.js');
INSERT INTO `sequelizemeta` VALUES ('20210813012958-create-user.js');
INSERT INTO `sequelizemeta` VALUES ('20210813013140-create-token.js');
INSERT INTO `sequelizemeta` VALUES ('20210813145553-create-avatar.js');
INSERT INTO `sequelizemeta` VALUES ('20210814071440-create-dept.js');
INSERT INTO `sequelizemeta` VALUES ('20210816143547-create-news.js');
INSERT INTO `sequelizemeta` VALUES ('20210818013127-create-advice.js');
INSERT INTO `sequelizemeta` VALUES ('20210819083515-create-table-title.js');
INSERT INTO `sequelizemeta` VALUES ('20210821032013-create-category.js');
INSERT INTO `sequelizemeta` VALUES ('20210821063827-create-news.js');
INSERT INTO `sequelizemeta` VALUES ('20210823082319-create-news.js');
INSERT INTO `sequelizemeta` VALUES ('20210827144242-create-job-seeker.js');
INSERT INTO `sequelizemeta` VALUES ('20210828020848-create-position.js');
INSERT INTO `sequelizemeta` VALUES ('20210828021520-create-post-2-position.js');

-- ----------------------------
-- Table structure for tabletitles
-- ----------------------------
DROP TABLE IF EXISTS `tabletitles`;
CREATE TABLE `tabletitles`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tabletitles
-- ----------------------------

-- ----------------------------
-- Table structure for tokens
-- ----------------------------
DROP TABLE IF EXISTS `tokens`;
CREATE TABLE `tokens`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userCode` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `user_token` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 118 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tokens
-- ----------------------------
INSERT INTO `tokens` VALUES (76, '10529', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjpudWxsLCJ0eXBlIjoianNvbndlYnRva2VuIiwiY3RpbWUiOjE2Mjg3Nzg5MzUwMjEsImlhdCI6MTYyODc3ODkzNSwiZXhwIjoxNjI4ODEzNDk1fQ.tnerO47SaVBgwmwWoMj7ow2LMHP1JeTbOP-bj159WeQ', '2021-08-12 14:35:35', '2021-08-12 14:35:35');
INSERT INTO `tokens` VALUES (77, '10529', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjpudWxsLCJ0eXBlIjoianNvbndlYnRva2VuIiwiY3RpbWUiOjE2Mjg3Nzg5NDMzODMsImlhdCI6MTYyODc3ODk0MywiZXhwIjoxNjI4ODEzNTAzfQ.NwX_IWAFpAaqauUB8YSNNqb16lJf54vWpSLiBNVm8TI', '2021-08-12 14:35:43', '2021-08-12 14:35:43');
INSERT INTO `tokens` VALUES (78, '10529', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjpudWxsLCJ0eXBlIjoianNvbndlYnRva2VuIiwiY3RpbWUiOjE2Mjg3Nzg5NjU1MDcsImlhdCI6MTYyODc3ODk2NSwiZXhwIjoxNjI4ODEzNTI1fQ.lUjv7RR3Jf1Zbsr5ceH1r-l11xKZLYiTVFcXBbGDo94', '2021-08-12 14:36:05', '2021-08-12 14:36:05');
INSERT INTO `tokens` VALUES (79, '10529', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjpudWxsLCJ0eXBlIjoianNvbndlYnRva2VuIiwiY3RpbWUiOjE2Mjg3Nzg5NzQwNTQsImlhdCI6MTYyODc3ODk3NCwiZXhwIjoxNjI4ODEzNTM0fQ.NhgYltmR2vlExGdaiennR_045yczsbWLoAeCAe_D08s', '2021-08-12 14:36:14', '2021-08-12 14:36:14');
INSERT INTO `tokens` VALUES (80, '10529', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjpudWxsLCJ0eXBlIjoianNvbndlYnRva2VuIiwiY3RpbWUiOjE2Mjg3NzkwMjMyNzksImlhdCI6MTYyODc3OTAyMywiZXhwIjoxNjI4ODEzNTgzfQ.1UCzOzan1onyssr8wGptsju3Ok-kufHYdBSgUDSsnwc', '2021-08-12 14:37:03', '2021-08-12 14:37:03');
INSERT INTO `tokens` VALUES (81, '10529', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjpudWxsLCJ0eXBlIjoianNvbndlYnRva2VuIiwiY3RpbWUiOjE2Mjg3NzkwNTkwNTQsImlhdCI6MTYyODc3OTA1OSwiZXhwIjoxNjI4ODEzNjE5fQ.snmEb2otDDNkpN2ApHayW6xCxBUmz5HFOK2vM957ECk', '2021-08-12 14:37:39', '2021-08-12 14:37:39');
INSERT INTO `tokens` VALUES (82, '10529', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjpudWxsLCJ0eXBlIjoianNvbndlYnRva2VuIiwiY3RpbWUiOjE2Mjg3NzkwNjk2NjksImlhdCI6MTYyODc3OTA2OSwiZXhwIjoxNjI4ODEzNjI5fQ.xl8Iz_4poKl8VB83F0lYBnF749bxcoYexiRRSmkOGE0', '2021-08-12 14:37:49', '2021-08-12 14:37:49');
INSERT INTO `tokens` VALUES (83, '10529', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjpudWxsLCJ0eXBlIjoianNvbndlYnRva2VuIiwiY3RpbWUiOjE2Mjg3NzkyNzM3NzEsImlhdCI6MTYyODc3OTI3MywiZXhwIjoxNjI4ODEzODMzfQ.M7uLy_3Z6bh1jC9aJEhWpv0KNqzODsIpV40QzzmLkAc', '2021-08-12 14:41:13', '2021-08-12 14:41:13');
INSERT INTO `tokens` VALUES (84, '10529', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjpudWxsLCJ0eXBlIjoianNvbndlYnRva2VuIiwiY3RpbWUiOjE2Mjg3NzkyODY2MjgsImlhdCI6MTYyODc3OTI4NiwiZXhwIjoxNjI4ODEzODQ2fQ.9gVmQEFshfkTzT7GBBsrSdkt-aYChO4JytH_ZEfR24E', '2021-08-12 14:41:26', '2021-08-12 14:41:26');
INSERT INTO `tokens` VALUES (85, '10529', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjpudWxsLCJ0eXBlIjoianNvbndlYnRva2VuIiwiY3RpbWUiOjE2Mjg3Nzk0NjY2OTYsImlhdCI6MTYyODc3OTQ2NiwiZXhwIjoxNjI4ODE0MDI2fQ.Qi85AgCua8O4SEE8oohCOHlIuJAyeupfOt4AmuBA5eQ', '2021-08-12 14:44:26', '2021-08-12 14:44:26');
INSERT INTO `tokens` VALUES (86, '10529', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjpudWxsLCJ0eXBlIjoianNvbndlYnRva2VuIiwiY3RpbWUiOjE2Mjg3Nzk0OTI1OTMsImlhdCI6MTYyODc3OTQ5MiwiZXhwIjoxNjI4ODE0MDUyfQ.wNOcBXFRQ1bN9a0kJ5xyHoJcV5VyiEucZz7HrhioR1E', '2021-08-12 14:44:52', '2021-08-12 14:44:52');
INSERT INTO `tokens` VALUES (87, '10529', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjpudWxsLCJ0eXBlIjoianNvbndlYnRva2VuIiwiY3RpbWUiOjE2Mjg3Nzk1OTc3MDQsImlhdCI6MTYyODc3OTU5NywiZXhwIjoxNjI4ODE0MTU3fQ.1qojwvPGnK_12OWCnZU58L_NtUmLj43sk9gCOCYsdks', '2021-08-12 14:46:37', '2021-08-12 14:46:37');
INSERT INTO `tokens` VALUES (88, '10529', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjpudWxsLCJ0eXBlIjoianNvbndlYnRva2VuIiwiY3RpbWUiOjE2Mjg3Nzk3NzY3MjAsImlhdCI6MTYyODc3OTc3NiwiZXhwIjoxNjI4ODE0MzM2fQ.qUokWMns5v3fpd8IiVkczfcVPSvbmu_95PdoxKbtEdQ', '2021-08-12 14:49:36', '2021-08-12 14:49:36');
INSERT INTO `tokens` VALUES (89, '10529', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjpudWxsLCJ0eXBlIjoianNvbndlYnRva2VuIiwiY3RpbWUiOjE2Mjg3ODExMDc5NDIsImlhdCI6MTYyODc4MTEwNywiZXhwIjoxNjI4ODE1NjY3fQ.H6BFSk0cIRpIZSQmmDydlF-rDF4KMtHG6MIvJdNl3RA', '2021-08-12 15:11:47', '2021-08-12 15:11:47');
INSERT INTO `tokens` VALUES (90, '10529', 'token', '2021-08-13 14:13:06', '2021-08-13 14:13:06');
INSERT INTO `tokens` VALUES (91, '10529', 'token', '2021-08-13 14:26:32', '2021-08-13 14:26:32');
INSERT INTO `tokens` VALUES (92, '10529', 'token', '2021-08-14 03:08:32', '2021-08-14 03:08:32');
INSERT INTO `tokens` VALUES (93, '10529', 'token', '2021-08-14 03:08:57', '2021-08-14 03:08:57');
INSERT INTO `tokens` VALUES (94, '10529', 'token', '2021-08-14 03:20:48', '2021-08-14 03:20:48');
INSERT INTO `tokens` VALUES (95, '01258', 'token', '2021-08-14 03:21:47', '2021-08-14 03:21:47');
INSERT INTO `tokens` VALUES (96, '10529', 'token', '2021-08-14 06:50:22', '2021-08-14 06:50:22');
INSERT INTO `tokens` VALUES (97, '10529', 'token', '2021-08-14 08:04:01', '2021-08-14 08:04:01');
INSERT INTO `tokens` VALUES (98, '10529', 'token', '2021-08-15 02:38:22', '2021-08-15 02:38:22');
INSERT INTO `tokens` VALUES (99, '10529', 'token', '2021-08-15 02:40:49', '2021-08-15 02:40:49');
INSERT INTO `tokens` VALUES (100, '10529', 'token', '2021-08-15 02:42:12', '2021-08-15 02:42:12');
INSERT INTO `tokens` VALUES (101, '10529', 'token', '2021-08-15 02:43:52', '2021-08-15 02:43:52');
INSERT INTO `tokens` VALUES (102, '10529', 'token', '2021-08-15 02:45:04', '2021-08-15 02:45:04');
INSERT INTO `tokens` VALUES (103, '10529', 'token', '2021-08-15 09:07:01', '2021-08-15 09:07:01');
INSERT INTO `tokens` VALUES (104, '10529', 'token', '2021-08-16 14:22:40', '2021-08-16 14:22:40');
INSERT INTO `tokens` VALUES (105, '10529', 'token', '2021-08-20 13:47:07', '2021-08-20 13:47:07');
INSERT INTO `tokens` VALUES (106, '10529', 'token', '2021-08-21 03:10:43', '2021-08-21 03:10:43');
INSERT INTO `tokens` VALUES (107, '10529', 'token', '2021-08-22 13:07:51', '2021-08-22 13:07:51');
INSERT INTO `tokens` VALUES (108, '10529', 'token', '2021-08-23 21:48:35', '2021-08-23 21:48:35');
INSERT INTO `tokens` VALUES (109, '10529', 'token', '2021-08-24 22:35:40', '2021-08-24 22:35:40');
INSERT INTO `tokens` VALUES (110, '10529', 'token', '2021-08-24 23:29:30', '2021-08-24 23:29:30');
INSERT INTO `tokens` VALUES (111, '10529', 'token', '2021-08-26 20:01:34', '2021-08-26 20:01:34');
INSERT INTO `tokens` VALUES (112, '10529', 'token', '2021-08-26 21:34:30', '2021-08-26 21:34:30');
INSERT INTO `tokens` VALUES (113, '10529', 'token', '2021-08-26 21:34:40', '2021-08-26 21:34:40');
INSERT INTO `tokens` VALUES (114, '10529', 'token', '2021-08-27 21:28:45', '2021-08-27 21:28:45');
INSERT INTO `tokens` VALUES (115, '10529', 'token', '2021-08-28 18:05:03', '2021-08-28 18:05:03');
INSERT INTO `tokens` VALUES (116, '10529', 'token', '2021-08-28 18:06:44', '2021-08-28 18:06:44');
INSERT INTO `tokens` VALUES (117, '10529', 'token', '2021-08-30 20:54:57', '2021-08-30 20:54:57');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userCode` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `role` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `deptCode` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `desc` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `loginNum` int(11) NULL DEFAULT NULL,
  `createdAt` datetime(0) NOT NULL,
  `updatedAt` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (8, '10529', '农丁安', '$2b$10$mq6PLl5x.ETo5I3JGEfIN.0UdDxVdfJQ2DuYGYZxSXLyM2dh8FBW2', 'nongdingan@126.com', 'admin', '102', NULL, 114, '2021-08-10 14:36:45', '2021-08-30 20:54:57');
INSERT INTO `users` VALUES (9, '01258', '张三', '$2b$10$Q2B3kaIE1H54HW2qTYZhKe6AJbxyehMhhzWCwIv1OZtf.taDigtwq', '1146952400@qq.com', 'editor-admin', '101', NULL, 1, '2021-08-14 03:21:25', '2021-08-14 03:21:47');
INSERT INTO `users` VALUES (10, '10530', '张磊', '$2b$10$wskD3Ewb8Y6.KQyolMSAGOHtxjOr0W/nocDt78VQaANuHqOXcVcJe', 'zhanglei@126.com', 'common', '103', NULL, 0, '2021-08-21 03:09:25', '2021-08-21 03:09:25');
INSERT INTO `users` VALUES (11, '10522', '刘航', '$2b$10$3iRhdR0SNfraBG4Bm8I3du9KgLpRd5/TkGZ71xZHGyAVdFKojPihy', 'liuhang@qq.com', 'common', '规划建设科', NULL, 0, '2021-08-24 22:35:31', '2021-08-24 22:35:31');

SET FOREIGN_KEY_CHECKS = 1;
