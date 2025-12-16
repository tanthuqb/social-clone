SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Ubuntu 15.1-1.pgdg20.04+1)
-- Dumped by pg_dump version 15.5 (Ubuntu 15.5-1.pgdg20.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '408af00e-9096-45be-9414-5a3d3cd35e52', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"thoqb123456@gmail.com","user_id":"08bf5461-2736-4317-9d02-177346a7aac7","user_phone":""}}', '2024-05-03 08:14:52.888494+00', ''),
	('00000000-0000-0000-0000-000000000000', '3783fed6-da3c-470f-8d0e-0b055a945043', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"kinemaeins@gmail.com","user_id":"9e043d12-da40-4d10-a258-4fd6aa9ea31c","user_phone":""}}', '2024-05-03 08:20:25.088204+00', ''),
	('00000000-0000-0000-0000-000000000000', '12c4e47d-5125-4b1d-b09a-994e617a207f', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"thoqb123456@gmail.com","user_id":"08bf5461-2736-4317-9d02-177346a7aac7","user_phone":""}}', '2024-05-03 09:59:47.444011+00', ''),
	('00000000-0000-0000-0000-000000000000', '32dd2bbc-78c6-40fa-99be-33c7d1e53d84', '{"action":"user_signedup","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"google"}}', '2024-05-03 10:06:10.706419+00', ''),
	('00000000-0000-0000-0000-000000000000', '56f3492a-bfa2-4f1c-9758-be2dc242161a', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"thoqb123456@gmail.com","user_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","user_phone":""}}', '2024-05-03 10:08:03.785582+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a1b64112-c0e6-476a-9c5a-8bbd2ad183da', '{"action":"login","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 06:40:01.038753+00', ''),
	('00000000-0000-0000-0000-000000000000', '2da46732-169a-4bf9-8238-9fe364083b47', '{"action":"login","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-04 06:40:22.345522+00', ''),
	('00000000-0000-0000-0000-000000000000', '06cedcdf-7dfa-4b7c-af30-a7478200c6ac', '{"action":"login","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 06:40:27.220643+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b2cd5d5b-d815-4c6e-8549-40e62a026e63', '{"action":"login","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 06:44:49.738628+00', ''),
	('00000000-0000-0000-0000-000000000000', '14cac8d7-1b8a-4bfd-a946-827d4a7968be', '{"action":"login","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 06:50:24.025793+00', ''),
	('00000000-0000-0000-0000-000000000000', '5959c9d2-2e04-4750-9675-ae43699bb245', '{"action":"user_recovery_requested","actor_id":"9e043d12-da40-4d10-a258-4fd6aa9ea31c","actor_username":"kinemaeins@gmail.com","actor_via_sso":false,"log_type":"user"}', '2024-05-04 07:49:30.735605+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cd831591-98ae-47ea-b946-c95db4f015a0', '{"action":"user_recovery_requested","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"user"}', '2024-05-04 07:50:06.846786+00', ''),
	('00000000-0000-0000-0000-000000000000', '9817b6ca-ee57-416a-bf06-f70f9776f865', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"kinemaeins@gmail.com","user_id":"9e043d12-da40-4d10-a258-4fd6aa9ea31c","user_phone":""}}', '2024-05-04 07:51:10.672962+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ef5e0465-79ea-4175-be5e-167b02178c71', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"kinemaeins@gmail.com","user_id":"26e6d0fc-6530-465e-9f8c-290a0f79a158","user_phone":""}}', '2024-05-04 07:51:23.917285+00', ''),
	('00000000-0000-0000-0000-000000000000', '6b5ad64f-68f7-443d-8838-a89fd0ec2a6c', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"heavendogg@gmail.com","user_id":"5df733d7-d4b5-4b66-affe-8bfc55ab72c6","user_phone":""}}', '2024-05-04 07:51:47.998094+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd188d255-8eb5-4dda-81b2-6aa510df9f4b', '{"action":"user_recovery_requested","actor_id":"5df733d7-d4b5-4b66-affe-8bfc55ab72c6","actor_username":"heavendogg@gmail.com","actor_via_sso":false,"log_type":"user"}', '2024-05-04 07:56:40.201443+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a2ce9835-8acf-4056-b794-937dfff5ac7f', '{"action":"user_recovery_requested","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"user"}', '2024-05-04 08:04:35.383875+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd50c0428-34c5-4a53-9af4-e83d4b32a182', '{"action":"user_recovery_requested","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"user"}', '2024-05-04 08:18:37.593805+00', ''),
	('00000000-0000-0000-0000-000000000000', '77f4c13f-e41b-4b6a-abb8-7d971ec55127', '{"action":"user_recovery_requested","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"user"}', '2024-05-04 08:19:51.376733+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e4e1d69b-372f-40a7-adb8-ae814109f4c4', '{"action":"user_recovery_requested","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"user"}', '2024-05-04 08:21:55.70281+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e1c402c8-8a02-489c-b57e-b5d4cb908ee3', '{"action":"user_recovery_requested","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"user"}', '2024-05-04 08:29:30.482452+00', ''),
	('00000000-0000-0000-0000-000000000000', '68a144e8-64da-4b1d-9a35-b04fcf6fa081', '{"action":"user_recovery_requested","actor_id":"26e6d0fc-6530-465e-9f8c-290a0f79a158","actor_username":"kinemaeins@gmail.com","actor_via_sso":false,"log_type":"user"}', '2024-05-04 08:53:26.203495+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ef417a3c-3fc0-4bf2-94ee-df81af538245', '{"action":"login","actor_id":"26e6d0fc-6530-465e-9f8c-290a0f79a158","actor_username":"kinemaeins@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-04 08:53:37.281688+00', ''),
	('00000000-0000-0000-0000-000000000000', 'abe8aaf6-b1f5-4e2f-9ffd-be083e47df31', '{"action":"user_recovery_requested","actor_id":"26e6d0fc-6530-465e-9f8c-290a0f79a158","actor_username":"kinemaeins@gmail.com","actor_via_sso":false,"log_type":"user"}', '2024-05-04 08:57:48.82012+00', ''),
	('00000000-0000-0000-0000-000000000000', '9f3325c6-1614-472f-a436-ae5556df703e', '{"action":"login","actor_id":"26e6d0fc-6530-465e-9f8c-290a0f79a158","actor_username":"kinemaeins@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-04 08:58:00.77499+00', ''),
	('00000000-0000-0000-0000-000000000000', '9494bc11-856a-4456-8dee-0e291da7369a', '{"action":"login","actor_id":"5df733d7-d4b5-4b66-affe-8bfc55ab72c6","actor_username":"heavendogg@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-04 09:21:20.251667+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b1342ccd-df8d-4de7-99a2-119a3ef42c0a', '{"action":"user_recovery_requested","actor_id":"26e6d0fc-6530-465e-9f8c-290a0f79a158","actor_username":"kinemaeins@gmail.com","actor_via_sso":false,"log_type":"user"}', '2024-05-04 09:35:52.665297+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ec460617-2ff4-488a-93e5-1df7b3b134ef', '{"action":"login","actor_id":"26e6d0fc-6530-465e-9f8c-290a0f79a158","actor_username":"kinemaeins@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-04 09:36:04.266009+00', ''),
	('00000000-0000-0000-0000-000000000000', '10d1764e-0a1f-4e24-9a4b-f1a9cc1b7cb8', '{"action":"login","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 10:00:14.31871+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f99bd4c3-6ba9-43a6-a0d9-d678f6b33207', '{"action":"login","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 10:01:12.998439+00', ''),
	('00000000-0000-0000-0000-000000000000', '9acdcf95-1fdc-48b5-aaba-fc76fd750cc6', '{"action":"login","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 10:01:54.408371+00', ''),
	('00000000-0000-0000-0000-000000000000', '40c6fd9e-4af2-4551-9959-a7c55c2ff3a9', '{"action":"login","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 10:01:58.899737+00', ''),
	('00000000-0000-0000-0000-000000000000', '566ebc13-886f-4a9d-a042-f1569189ece6', '{"action":"login","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 10:02:04.367106+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a172f45e-6b43-42a3-8769-880a6c239677', '{"action":"login","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 10:02:06.175581+00', ''),
	('00000000-0000-0000-0000-000000000000', '87be20e7-ceef-4ea1-a755-627b24ab0153', '{"action":"login","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 10:02:17.355217+00', ''),
	('00000000-0000-0000-0000-000000000000', '91f18ab1-fac5-4c5e-9af5-c6cbe4e8301c', '{"action":"login","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 10:02:21.967403+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b157e3be-c25c-4f28-b7d2-71cc87b74c63', '{"action":"login","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 10:02:58.686611+00', ''),
	('00000000-0000-0000-0000-000000000000', '04a74344-3c83-4fa6-840f-c911bea58bc3', '{"action":"login","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 10:21:49.747082+00', ''),
	('00000000-0000-0000-0000-000000000000', '75e1cd18-575b-48ff-aa0d-705c083fc302', '{"action":"login","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 10:23:46.308146+00', ''),
	('00000000-0000-0000-0000-000000000000', '1542a7b5-a8cd-4c4a-bca3-6be432dbcc44', '{"action":"login","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 12:28:49.937381+00', ''),
	('00000000-0000-0000-0000-000000000000', '0bf894ae-a627-4245-8db7-e36aabf6415c', '{"action":"login","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-04 12:28:55.378136+00', ''),
	('00000000-0000-0000-0000-000000000000', '60ba7b3f-7fb5-4d28-b991-95fae89ec103', '{"action":"user_recovery_requested","actor_id":"26e6d0fc-6530-465e-9f8c-290a0f79a158","actor_username":"kinemaeins@gmail.com","actor_via_sso":false,"log_type":"user"}', '2024-05-04 12:29:58.961167+00', ''),
	('00000000-0000-0000-0000-000000000000', '4b81eea4-83fb-4bbf-84cc-4c0b609b0919', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 14:08:25.80654+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dbe2e173-49ee-47e5-a5ef-43d42993f69d', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-04 14:11:17.424085+00', ''),
	('00000000-0000-0000-0000-000000000000', 'acb21bfe-20d1-48b0-a7dc-dc43c0da0f57', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 14:11:24.285484+00', ''),
	('00000000-0000-0000-0000-000000000000', '316ac51b-e83d-4599-b828-cc18aea798cf', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-04 14:12:36.954233+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bbca5347-5357-4ba6-be57-438b871d1f2e', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 14:13:08.787407+00', ''),
	('00000000-0000-0000-0000-000000000000', '7d89c586-33b5-4dd5-a3ad-089e9fe6598b', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 14:32:26.993162+00', ''),
	('00000000-0000-0000-0000-000000000000', '65cad0be-93b3-4419-af26-edd8e06c4f54', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-04 14:33:43.688676+00', ''),
	('00000000-0000-0000-0000-000000000000', '07e9f3c4-5db0-436b-8d7b-164b21ae1fc1', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 14:34:36.480442+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b0ccc878-0da9-43ef-923d-f1279ba74019', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-04 14:35:09.781379+00', ''),
	('00000000-0000-0000-0000-000000000000', '56b625e7-7d8c-433d-aaf7-71164fb2e52d', '{"action":"user_signedup","actor_id":"1d4a3b9d-3950-424d-94d3-717d46851eb4","actor_name":"Lộc Hoàng Công","actor_username":"muahanggiatot.live@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"google"}}', '2024-05-04 14:35:13.052203+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cccc531a-2f03-4da4-9879-e90cf680628a', '{"action":"login","actor_id":"1d4a3b9d-3950-424d-94d3-717d46851eb4","actor_name":"Lộc Hoàng Công","actor_username":"muahanggiatot.live@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-04 14:38:55.514522+00', ''),
	('00000000-0000-0000-0000-000000000000', 'de5cf39e-3ed3-4b3f-a219-f519b5c56512', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 14:40:12.133266+00', ''),
	('00000000-0000-0000-0000-000000000000', '03c01fa9-5d76-4d67-820c-b7f57e7e87ea', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 14:44:11.171408+00', ''),
	('00000000-0000-0000-0000-000000000000', '781da323-e2bb-4757-bda6-03b2e4f287db', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-04 14:48:36.02869+00', ''),
	('00000000-0000-0000-0000-000000000000', '025847d3-81eb-4079-9c5e-ed8c6fe2b3ca', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 14:48:41.909157+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e02c253a-a50b-4879-b3c8-91f256b2e87e', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-04 14:49:03.06027+00', ''),
	('00000000-0000-0000-0000-000000000000', '6193d50a-f2f0-4bdc-8842-337bd3d56e87', '{"action":"login","actor_id":"1d4a3b9d-3950-424d-94d3-717d46851eb4","actor_name":"Lộc Hoàng Công","actor_username":"muahanggiatot.live@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 14:49:15.088824+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a2aebd2a-de76-4a8a-9353-d225006deb1f', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 14:54:38.281777+00', ''),
	('00000000-0000-0000-0000-000000000000', '5d73fc14-fce9-4cfd-ae9a-faa9a008c6b4', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-04 14:55:34.25912+00', ''),
	('00000000-0000-0000-0000-000000000000', '23a874da-e028-4e49-868a-e9e7568ddead', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 14:57:45.463629+00', ''),
	('00000000-0000-0000-0000-000000000000', '8d64c9db-9891-446b-b2e1-99bc2943fbf0', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-04 14:59:49.540837+00', ''),
	('00000000-0000-0000-0000-000000000000', '5c1edd6d-3186-4d83-8e06-9af7bfcc2a83', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 15:02:15.347208+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c2a832a1-7b45-4cda-a61f-f9c8fa739469', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-04 15:03:09.207872+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e925a0f3-74c6-4835-b690-9cc90fb3be0b', '{"action":"token_refreshed","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-05-04 15:11:49.211227+00', ''),
	('00000000-0000-0000-0000-000000000000', '19695792-1e6b-4033-9d4e-d9baf38da982', '{"action":"token_revoked","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-05-04 15:11:49.212827+00', ''),
	('00000000-0000-0000-0000-000000000000', '2bf0e69c-858d-457c-88c4-49c3c4241d64', '{"action":"login","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 15:12:00.501424+00', ''),
	('00000000-0000-0000-0000-000000000000', '05af240f-5d7e-42ea-81c2-9a4ae3c896f0', '{"action":"login","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-04 15:12:09.43601+00', ''),
	('00000000-0000-0000-0000-000000000000', '00acc5c4-bf42-4e33-a297-f0b2aa3fe46f', '{"action":"login","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 15:12:20.029829+00', ''),
	('00000000-0000-0000-0000-000000000000', '1a00d1f2-5bee-43a2-ad43-b7ec26eb3ce1', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 15:32:48.022018+00', ''),
	('00000000-0000-0000-0000-000000000000', '6a45b356-bff7-4464-bbd4-6f8447516e0d', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-04 15:33:06.316986+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a3f31dc4-8ae6-4076-b554-4ed0c902d8ac', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 15:33:11.11166+00', ''),
	('00000000-0000-0000-0000-000000000000', '176c966f-7dc3-4ec8-98e1-cade3bbf6f6c', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 15:33:35.253686+00', ''),
	('00000000-0000-0000-0000-000000000000', 'acfa6638-2611-4a27-88f1-58ccfc14a8a9', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-04 15:34:05.74047+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c1ade626-b079-450e-a692-95c5b1fa470a', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 15:34:11.150609+00', ''),
	('00000000-0000-0000-0000-000000000000', '24773a17-98a1-4a4f-919c-1aed02745ddf', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-04 15:38:55.183019+00', ''),
	('00000000-0000-0000-0000-000000000000', '0660354a-e51f-4691-86d1-d6f73f7ef964', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 15:39:04.583416+00', ''),
	('00000000-0000-0000-0000-000000000000', '72cfdada-3e08-4038-9024-477987f0c42a', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 15:39:25.574597+00', ''),
	('00000000-0000-0000-0000-000000000000', '6d74108b-38d2-4f82-b15d-f22d3e001864', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 15:50:29.419159+00', ''),
	('00000000-0000-0000-0000-000000000000', '55ce4409-b1b1-48d4-a67c-d996359e9ecc', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-04 15:53:53.893065+00', ''),
	('00000000-0000-0000-0000-000000000000', '3accb752-a290-4752-b3b8-fad915ee65c8', '{"action":"logout","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-05 15:01:07.518614+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd7495a66-907c-417d-a2d4-1f811e05ef3a', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 15:53:58.819472+00', ''),
	('00000000-0000-0000-0000-000000000000', '560c603b-dd85-4a83-9fd9-56c7c6705347', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-04 15:55:35.876682+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c4c21f14-8aca-4bc5-a9bc-b070bc8d148c', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 15:57:06.334624+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fd373e06-13e0-4346-ac77-df12760e8859', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-04 15:59:41.487127+00', ''),
	('00000000-0000-0000-0000-000000000000', '796be214-5238-4f30-9bfc-d7c496333afe', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 15:59:46.130398+00', ''),
	('00000000-0000-0000-0000-000000000000', '57a42f28-3d1c-4229-b6d2-6cd8307cdc35', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 16:05:49.338442+00', ''),
	('00000000-0000-0000-0000-000000000000', '78646102-e763-4562-8263-36c87c0c6ca2', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 16:14:00.905858+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd06f29b7-7209-4d85-ab45-d34ae5476536', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-04 16:14:06.566551+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f702cc33-5d04-4c89-abec-2e7ca560844a', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 16:14:09.168277+00', ''),
	('00000000-0000-0000-0000-000000000000', '4f642899-d50c-4db3-981d-34d7198cf089', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-04 16:14:31.233362+00', ''),
	('00000000-0000-0000-0000-000000000000', '4c902ea9-d8fb-4c56-85e9-351263d8764c', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 16:15:14.943426+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c0239e0b-2616-41b9-9368-c4f313f5617a', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-04 16:17:58.108387+00', ''),
	('00000000-0000-0000-0000-000000000000', '8a63471f-04f3-4010-b04a-0832738f82ca', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 16:18:01.013284+00', ''),
	('00000000-0000-0000-0000-000000000000', '37e45f8e-c323-4cb5-99ce-836c3783a443', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-04 16:18:36.092891+00', ''),
	('00000000-0000-0000-0000-000000000000', '611058cc-5619-4250-a599-0c4a5c6b61fa', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 16:18:52.53024+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a162d68b-21b6-4671-ab80-d93997f4c8be', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-04 16:19:50.679664+00', ''),
	('00000000-0000-0000-0000-000000000000', '1f563c17-b0e3-476e-83b0-19ba6be0c297', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 16:19:56.16978+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c735dc5d-06be-418c-8972-197f015e684f', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-04 16:21:57.064108+00', ''),
	('00000000-0000-0000-0000-000000000000', '70a89390-a52d-4ebf-a253-0c66f1ad1c35', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 16:22:00.714817+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f82b34a4-75a6-451b-8ace-93db1ff63c50', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 16:23:09.826634+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e90e384a-dbab-489a-92df-af3db6ecb3b9', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-04 16:27:25.180451+00', ''),
	('00000000-0000-0000-0000-000000000000', '322e4d7a-9866-40c1-9e6c-07f0af150000', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 16:27:27.950782+00', ''),
	('00000000-0000-0000-0000-000000000000', '74f92bd3-dace-45fa-9c14-88ece0b8df31', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 16:28:10.460528+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fbea3209-ee45-4fd4-bd24-9f90e9b30363', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-04 16:28:52.342466+00', ''),
	('00000000-0000-0000-0000-000000000000', '04bfa8b4-c9d6-401b-8196-476489a9bf64', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 16:28:57.348997+00', ''),
	('00000000-0000-0000-0000-000000000000', 'abdbc860-e395-4ee6-92b8-d2c0dbdc5354', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-04 16:29:26.360006+00', ''),
	('00000000-0000-0000-0000-000000000000', '6c099657-e4f4-4e46-b409-01002ded3d28', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 16:29:31.451632+00', ''),
	('00000000-0000-0000-0000-000000000000', '2bfcbc90-c5cf-4ab2-91df-be5156933471', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-04 16:30:24.651367+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b0c929b2-7b7f-4ff9-b6d0-dfb4fb34dd9f', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 16:30:30.824826+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b8752e7e-ea2a-435f-b442-e455d59659e1', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 17:17:57.311953+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e9b2d6be-ad7b-43a1-ab9e-12a11ab25dac', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 17:21:09.233965+00', ''),
	('00000000-0000-0000-0000-000000000000', '94994697-3aef-4f09-a678-1a261cb2368e', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 17:26:16.264756+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ee1ba348-f45c-49d5-a9f0-4084120965d4', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-04 17:28:21.545516+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b02c2ebd-6e34-4902-95e6-af352bfa07b8', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 17:28:26.396906+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fd5cccc2-8df6-44cc-84e6-bf3f7cd845ec', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 17:37:48.079276+00', ''),
	('00000000-0000-0000-0000-000000000000', 'de3f3483-d4f2-4c13-ac8c-bbb221db1ad8', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 17:49:25.543641+00', ''),
	('00000000-0000-0000-0000-000000000000', '68b3f59b-810b-4089-b81c-c37404e4b057', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-04 17:49:26.991012+00', ''),
	('00000000-0000-0000-0000-000000000000', 'eca50597-7962-47b9-aa49-45f426d6bcb4', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 17:50:23.105434+00', ''),
	('00000000-0000-0000-0000-000000000000', '343d33ee-70e7-4ea5-b77d-5ac06319abca', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-04 17:50:23.386626+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bf6df738-bcc1-4718-a58e-477086557822', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-04 17:54:20.23635+00', ''),
	('00000000-0000-0000-0000-000000000000', '077c5b74-907a-4282-a2e5-0efeee2ce2af', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-04 17:54:20.771663+00', ''),
	('00000000-0000-0000-0000-000000000000', '3693373e-0596-4ebf-ab72-e1d9c49e573d', '{"action":"token_refreshed","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-05-05 05:46:40.602416+00', ''),
	('00000000-0000-0000-0000-000000000000', '02e4e793-eea7-4aa7-bd9f-fd2b11f51a8e', '{"action":"token_revoked","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-05-05 05:46:40.604143+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e90d628f-2de4-4610-9e7d-703aba1b547d', '{"action":"token_refreshed","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-05-05 05:47:48.643004+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd5b794aa-0bb3-46e3-a156-8d1fb81df03c', '{"action":"token_refreshed","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-05-05 05:47:51.249287+00', ''),
	('00000000-0000-0000-0000-000000000000', '3c69df65-aba6-4df9-afd8-239c290402bd', '{"action":"token_refreshed","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-05-05 05:47:55.659574+00', ''),
	('00000000-0000-0000-0000-000000000000', '85e0ffea-42d2-4f3f-9c74-cb2fdf085a6a', '{"action":"token_refreshed","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-05-05 05:48:06.560321+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cb44c48e-5349-4474-b28a-a387864acd62', '{"action":"token_refreshed","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-05-05 05:48:07.025558+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c61a95b0-1fca-4ec9-aeff-abc29a439377', '{"action":"token_refreshed","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-05-05 05:48:07.537486+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a6b49457-4902-4c77-ba4d-6a4ed94c11a1', '{"action":"token_refreshed","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-05-05 05:48:11.187694+00', ''),
	('00000000-0000-0000-0000-000000000000', '7a9f35dc-ea3f-45ee-aa93-54c16e0ea52e', '{"action":"token_refreshed","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-05-05 05:48:11.774855+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e185a902-4952-49f0-850e-585a6455149a', '{"action":"token_refreshed","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-05-05 05:48:13.854338+00', ''),
	('00000000-0000-0000-0000-000000000000', '2185c5c0-ab1e-484e-9f8d-a2852591323b', '{"action":"token_refreshed","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-05-05 05:48:14.214686+00', ''),
	('00000000-0000-0000-0000-000000000000', '46591d7b-cba4-49c6-82ed-707f674677ca', '{"action":"token_refreshed","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-05-05 05:48:14.608092+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fa334e4d-3111-46d9-81a4-ba8117b93ddf', '{"action":"token_refreshed","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-05-05 05:48:17.026127+00', ''),
	('00000000-0000-0000-0000-000000000000', '23c676fc-ad1d-4de5-8123-a077c3e3d843', '{"action":"token_refreshed","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-05-05 05:48:17.480937+00', ''),
	('00000000-0000-0000-0000-000000000000', '4e86526e-f1a5-4628-97c8-9bce48d58e6b', '{"action":"token_refreshed","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-05-05 05:48:35.223273+00', ''),
	('00000000-0000-0000-0000-000000000000', '995fd2d0-aec9-4630-aa2a-457085448d9f', '{"action":"user_recovery_requested","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"user"}', '2024-05-05 06:04:41.714336+00', ''),
	('00000000-0000-0000-0000-000000000000', '3418b37c-de47-4819-a132-956bcbff7cca', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-05 06:45:40.465921+00', ''),
	('00000000-0000-0000-0000-000000000000', '63dccf05-6812-41fa-bea4-b3c2c2bd4972', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-05 06:45:43.954709+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e2ca2ecc-5ee2-4af9-b4bc-a31880ebf7f3', '{"action":"logout","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-05 06:48:33.237007+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e6079454-23fb-4556-9876-ff40a02cfa3f', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-05 06:49:46.823903+00', ''),
	('00000000-0000-0000-0000-000000000000', '6c11b8a4-8960-472a-88b3-f2cba1855e59', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-05 06:49:48.455001+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c5e230bf-b8c9-4402-8fd4-74fc50305064', '{"action":"logout","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-05 06:50:04.202304+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cc2cebb3-b367-4aab-8d91-3026e236e4d8', '{"action":"user_recovery_requested","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"user"}', '2024-05-05 06:51:48.002599+00', ''),
	('00000000-0000-0000-0000-000000000000', '13dae1b7-e921-499a-bac2-ceb76589e3a2', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-05 06:51:49.034736+00', ''),
	('00000000-0000-0000-0000-000000000000', '2b75cf37-c4d0-446d-b27b-5b40d0cb632d', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-05 06:51:51.003522+00', ''),
	('00000000-0000-0000-0000-000000000000', '00e51aa4-c970-4acb-b9e5-80268b6ee464', '{"action":"logout","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-05 06:51:55.127569+00', ''),
	('00000000-0000-0000-0000-000000000000', '52e97605-4a7f-4363-9aa2-d44027a6dd5d', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-05 06:52:28.360682+00', ''),
	('00000000-0000-0000-0000-000000000000', '4c6633b8-5ae2-485a-a6d2-c943e79a83f3', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-05 06:52:28.688496+00', ''),
	('00000000-0000-0000-0000-000000000000', '073e2d37-7759-4002-8bad-c0b73658de16', '{"action":"logout","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-05 06:52:47.882326+00', ''),
	('00000000-0000-0000-0000-000000000000', '23288460-597d-4c0e-b73f-adc532bff4dd', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-05 06:53:03.799792+00', ''),
	('00000000-0000-0000-0000-000000000000', '6bd3fae6-117b-4621-b520-9d027f75a576', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-05 06:53:04.115478+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd55033b5-35d0-4c53-afc9-444f92723bf7', '{"action":"logout","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-05 06:53:07.903172+00', ''),
	('00000000-0000-0000-0000-000000000000', '5eab0eb8-6858-4e5d-83e9-b0fd4480f77a', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-05 06:54:18.329425+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b8e51b27-0730-4506-b2b5-95990e87a7d1', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-05 06:54:18.599643+00', ''),
	('00000000-0000-0000-0000-000000000000', 'aba73b3a-7dd6-49bc-b8e0-fd03d15ce0c8', '{"action":"logout","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-05 06:54:22.311919+00', ''),
	('00000000-0000-0000-0000-000000000000', '82d2df79-d76c-490c-bf22-4244ff8764a0', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"kinemaeins@gmail.com","user_id":"26e6d0fc-6530-465e-9f8c-290a0f79a158","user_phone":""}}', '2024-05-05 06:54:54.087462+00', ''),
	('00000000-0000-0000-0000-000000000000', '8165bfb1-c046-4063-b209-4ffc0150ec97', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-05 06:54:57.764911+00', ''),
	('00000000-0000-0000-0000-000000000000', '70026a5c-2363-4a5e-8248-ea7c12519dcf', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-05 06:54:58.049691+00', ''),
	('00000000-0000-0000-0000-000000000000', '367b1e4d-a68d-4015-aa8d-cbee34a78c85', '{"action":"user_confirmation_requested","actor_id":"c0123b42-b761-4b77-92fa-7adbb7f87b38","actor_username":"kinemaeins@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2024-05-05 06:54:59.096432+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a4e980db-1263-424b-b845-f17afad3695e', '{"action":"logout","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-05 06:55:01.805369+00', ''),
	('00000000-0000-0000-0000-000000000000', '5c1a2d5a-9bfb-45ac-a973-e1056d287634', '{"action":"user_signedup","actor_id":"c0123b42-b761-4b77-92fa-7adbb7f87b38","actor_username":"kinemaeins@gmail.com","actor_via_sso":false,"log_type":"team"}', '2024-05-05 06:55:32.003644+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f38093f9-3b1c-4fbc-b32f-141aad65d056', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-05 06:55:34.39428+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fdb85c6c-47ed-4aec-beb7-eaab68328c5b', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-05 06:55:34.676698+00', ''),
	('00000000-0000-0000-0000-000000000000', '373c62d3-3bc5-48e7-81a7-8fee3309cdcb', '{"action":"login","actor_id":"c0123b42-b761-4b77-92fa-7adbb7f87b38","actor_username":"kinemaeins@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-05-05 06:55:36.711001+00', ''),
	('00000000-0000-0000-0000-000000000000', '50802ad1-411c-4280-a659-4775f12dacc3', '{"action":"login","actor_id":"c0123b42-b761-4b77-92fa-7adbb7f87b38","actor_username":"kinemaeins@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-05-05 06:55:41.729767+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ac5f8160-4722-4df0-9f6d-f97257ca81f8', '{"action":"logout","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-05 06:55:59.199658+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fbd936d5-d66d-4e29-aef1-b175208ec11c', '{"action":"login","actor_id":"c0123b42-b761-4b77-92fa-7adbb7f87b38","actor_username":"kinemaeins@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-05-05 06:56:16.490246+00', ''),
	('00000000-0000-0000-0000-000000000000', '939a9bdd-a91d-49f2-9306-54b7da8c7c15', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-05 06:56:33.843156+00', ''),
	('00000000-0000-0000-0000-000000000000', '3c3b5800-0d03-472f-87d9-2eb8a3def8a5', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-05 06:56:34.05332+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fd22c139-6ceb-47b9-a7de-c9f903114027', '{"action":"logout","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-05 06:56:37.397436+00', ''),
	('00000000-0000-0000-0000-000000000000', 'aa5a9b8d-bef7-4ecc-a07d-a7cd2daa6508', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"kinemaeins@gmail.com","user_id":"c0123b42-b761-4b77-92fa-7adbb7f87b38","user_phone":""}}', '2024-05-05 06:56:53.248413+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f4a49fe0-418c-46b0-8c23-e9cc867cb8c6', '{"action":"login","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-05 06:56:57.232537+00', ''),
	('00000000-0000-0000-0000-000000000000', '45dfd46d-5f57-4a9c-8382-af27cf9e8e97', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-05 06:57:33.570599+00', ''),
	('00000000-0000-0000-0000-000000000000', '29d6b83b-b98b-4d83-9a2b-b5549cbe3ccd', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-05 06:57:33.86606+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a5f369d1-c346-4288-b65a-907e38d69e00', '{"action":"logout","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-05 06:57:37.649181+00', ''),
	('00000000-0000-0000-0000-000000000000', '06d38c98-1147-4ce5-ac02-2678e1f174ac', '{"action":"login","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-05 06:59:57.861591+00', ''),
	('00000000-0000-0000-0000-000000000000', '0d569f70-3eec-4314-861b-a8ced31fa1e9', '{"action":"login","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-05 06:59:59.965315+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c6f42249-c801-4e43-a3ac-350d15b0ed9c', '{"action":"logout","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-05 07:00:20.44048+00', ''),
	('00000000-0000-0000-0000-000000000000', '4d658118-3f42-4235-bf2e-e1eeeb1771e1', '{"action":"user_recovery_requested","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"user"}', '2024-05-05 07:28:35.744425+00', ''),
	('00000000-0000-0000-0000-000000000000', '6ba69b16-8e3c-47c2-a32c-a61e58346027', '{"action":"login","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-05 07:28:55.931725+00', ''),
	('00000000-0000-0000-0000-000000000000', '2c26d8c8-bd35-463b-9ebf-57cd6e8b9870', '{"action":"login","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"magiclink"}}', '2024-05-05 07:28:57.821698+00', ''),
	('00000000-0000-0000-0000-000000000000', '7bfd8dc2-159d-4c97-8734-a5d24f9b865a', '{"action":"logout","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-05 07:29:04.723618+00', ''),
	('00000000-0000-0000-0000-000000000000', '17cbe434-365c-49c7-84cc-a9fd6af29446', '{"action":"user_recovery_requested","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"user"}', '2024-05-05 07:29:37.668548+00', ''),
	('00000000-0000-0000-0000-000000000000', '05286e89-b18e-4bd5-a6d7-76f33877de8b', '{"action":"login","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-05 07:30:08.301931+00', ''),
	('00000000-0000-0000-0000-000000000000', '53d2bc77-ff80-4b14-bef9-52d8db8195c9', '{"action":"login","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"magiclink"}}', '2024-05-05 07:30:08.817279+00', ''),
	('00000000-0000-0000-0000-000000000000', '0198a15d-7887-4e84-951d-271f83b0d456', '{"action":"logout","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-05 07:30:18.590708+00', ''),
	('00000000-0000-0000-0000-000000000000', '7de27dc0-77c0-4ad6-8f00-b57d0d0d4067', '{"action":"user_recovery_requested","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"user"}', '2024-05-05 07:30:38.111904+00', ''),
	('00000000-0000-0000-0000-000000000000', '5f925be2-617a-44aa-84ff-3a24e4c88d09', '{"action":"login","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-05 07:30:49.013003+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a4bcae95-83ba-436f-ab82-5e74c0b55317', '{"action":"login","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"magiclink"}}', '2024-05-05 07:30:49.362267+00', ''),
	('00000000-0000-0000-0000-000000000000', '5d9bdb64-697a-4ffb-ad70-ab4d543dede2', '{"action":"logout","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-05 07:33:12.879651+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bc3b0235-ecda-4200-b4a6-b4e17ac15d5e', '{"action":"user_recovery_requested","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"user"}', '2024-05-05 07:33:22.970301+00', ''),
	('00000000-0000-0000-0000-000000000000', '7d647703-0953-49a3-96fa-6a5edcfe89b3', '{"action":"login","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-05 07:33:37.955135+00', ''),
	('00000000-0000-0000-0000-000000000000', '4a2c83cb-5fe7-4b7c-bc67-cbc3a00d395f', '{"action":"login","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"magiclink"}}', '2024-05-05 07:33:39.820373+00', ''),
	('00000000-0000-0000-0000-000000000000', '652718e6-95b9-463d-8fdc-b014487789f3', '{"action":"logout","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-05 07:35:19.915911+00', ''),
	('00000000-0000-0000-0000-000000000000', '2eab845f-0a4c-43cb-adac-8e58d1d08d02', '{"action":"user_recovery_requested","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"user"}', '2024-05-05 07:35:26.492661+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd8304242-94d3-44d3-bbb0-85765df223e2', '{"action":"login","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-05 07:35:40.742327+00', ''),
	('00000000-0000-0000-0000-000000000000', '4f22661e-f872-4bb1-82b6-2059590762cf', '{"action":"login","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"magiclink"}}', '2024-05-05 07:35:41.034852+00', ''),
	('00000000-0000-0000-0000-000000000000', '2edbee89-b650-478b-a096-58ad8fe8fc08', '{"action":"user_recovery_requested","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"user"}', '2024-05-05 07:36:33.870721+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ee429722-12f2-455f-a697-948d7f10e62c', '{"action":"logout","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-05 07:43:50.266599+00', ''),
	('00000000-0000-0000-0000-000000000000', '321adf67-51c5-4690-ac4b-28febde57808', '{"action":"user_recovery_requested","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"user"}', '2024-05-05 07:43:57.00801+00', ''),
	('00000000-0000-0000-0000-000000000000', '4b678c0e-e04e-49a9-84f7-dd60f3174782', '{"action":"login","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-05 07:44:08.341321+00', ''),
	('00000000-0000-0000-0000-000000000000', '3e2ef0df-6ce9-4d8f-956e-4f78e49d7c44', '{"action":"login","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"magiclink"}}', '2024-05-05 07:44:08.704988+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f03578af-5a71-4c96-a6de-2fc1a18c3b56', '{"action":"token_refreshed","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-05-05 08:50:16.745371+00', ''),
	('00000000-0000-0000-0000-000000000000', '4b5ba0c4-9306-44de-a79a-b04bb496489d', '{"action":"token_revoked","actor_id":"56c3dd3a-1698-4a1b-aa70-df57a93649e0","actor_name":"Thọ Hoàng Công","actor_username":"thoqb123456@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-05-05 08:50:16.748794+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f4a9f3e6-8948-4dce-a1ee-5f0025094339', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-05 14:37:20.848427+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b04325b1-932a-42ac-b293-59ef753fbe7b', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-05 14:37:47.232233+00', ''),
	('00000000-0000-0000-0000-000000000000', '26ef1266-c9f2-44b3-b620-91a8d5369d0c', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-05 14:39:24.167235+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e99891bf-48cc-4c69-997b-92439f18a46b', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-05 14:42:37.948521+00', ''),
	('00000000-0000-0000-0000-000000000000', '26db0044-a6ba-4e6c-b01c-2471d848feb2', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-05 14:43:12.894005+00', ''),
	('00000000-0000-0000-0000-000000000000', '3f123109-cb75-425c-92a6-9cb6b296d84f', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-05 14:43:34.140774+00', ''),
	('00000000-0000-0000-0000-000000000000', '05d4fa2c-a78d-4d73-a392-4435ee1dd114', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-05 14:43:34.511364+00', ''),
	('00000000-0000-0000-0000-000000000000', '96d5f344-64bb-40c3-ac89-78c654c76817', '{"action":"logout","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-05 14:50:03.204257+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd0a3e176-9d94-4a43-9637-ab92f52d027a', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-05 14:54:31.580784+00', ''),
	('00000000-0000-0000-0000-000000000000', '19337450-b080-4e7b-ba98-1577a4bb63a1', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-05 14:54:33.08545+00', ''),
	('00000000-0000-0000-0000-000000000000', '560c42af-0763-400a-ac7f-866949479f7c', '{"action":"logout","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-05 14:56:07.350813+00', ''),
	('00000000-0000-0000-0000-000000000000', '0c8b0f53-f679-44df-bad9-086c7bb08f38', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-05 14:57:43.043059+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c45fcb1f-c1c8-42ed-8133-94298bcf49bf', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-05 14:57:44.118795+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f0e07d3a-7b38-445a-90dd-f451e36e9dd9', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-05 15:01:33.894189+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e92fdbfd-6305-403d-85fc-2fe4c8c9ee10', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-05 15:01:35.460457+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b3ff3036-5284-4fae-9c15-cc498d692e08', '{"action":"logout","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-05 15:01:39.294536+00', ''),
	('00000000-0000-0000-0000-000000000000', '2c18eb5d-4d17-4379-a7fe-470e25fa0979', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-05 15:05:02.605904+00', ''),
	('00000000-0000-0000-0000-000000000000', '994e8555-3f34-4fcf-8c74-aade64055b2c', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-05 15:05:04.040673+00', ''),
	('00000000-0000-0000-0000-000000000000', '80fc0ee2-287f-491e-b8ff-0ada519d4c01', '{"action":"logout","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-05 15:06:40.283525+00', ''),
	('00000000-0000-0000-0000-000000000000', '62f621c2-e412-4ff2-9488-10083f9ddc8b', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-05 15:07:41.830063+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f643fe9e-33ed-4af8-b615-2a775291b669', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-05 15:07:42.931263+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd5d3b91e-2df3-4e7a-9c32-d2fb27b22bbf', '{"action":"logout","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-05 15:11:26.599179+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b2eb4a4e-758b-4379-a5f6-4d3eb79d2974', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-05 15:12:02.107731+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a56f26ff-c0fc-42f7-8420-9939552a488a', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-05 15:12:03.546174+00', ''),
	('00000000-0000-0000-0000-000000000000', '63342bca-b70b-4b73-9853-f443f5ab0995', '{"action":"logout","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-05 15:12:51.203657+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd0b81afc-d38f-4a12-adb6-9668e219db03', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-05 15:13:15.384505+00', ''),
	('00000000-0000-0000-0000-000000000000', '80f620e3-a6d7-4b5a-900a-df6e2e195cd5', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-05 15:13:15.757617+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd7aa3294-8b03-49e6-b30f-dff951770438', '{"action":"logout","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-05 15:14:35.85789+00', ''),
	('00000000-0000-0000-0000-000000000000', '4d5c59c9-e41a-49f2-a9d8-cf3ff05bfeb9', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-05 15:15:37.156559+00', ''),
	('00000000-0000-0000-0000-000000000000', '408c133d-fd46-47fc-9468-7c6af076590b', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-05 15:15:38.485392+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e652b478-9f5c-4afa-a9f3-98ff9a682ba5', '{"action":"logout","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-05 15:16:14.621783+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ceb7cc64-8f39-4568-afc7-13b5f7be07a9', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2024-05-05 15:19:21.585244+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cc570ff6-7723-49e8-b352-c9b6abe86a81', '{"action":"login","actor_id":"212c8cf9-23e4-4c1a-8067-4cc7db61992e","actor_name":"Loc Hoang","actor_username":"tanthuqb91@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2024-05-05 15:19:22.647627+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at") VALUES
	('eaf33d46-039a-49f7-8ae5-f9affe0c1c22', NULL, 'a74e085a-0577-4729-9e7a-62b8c671ea0f', 's256', 'eOPsnseCIjpxvi4DfufbrN-ku4FGfN74WhSllnpEkMY', 'google', '', '', '2024-05-03 10:02:44.794546+00', '2024-05-03 10:02:44.794546+00', 'oauth', NULL),
	('f1714830-6325-48e3-8f89-3c35833388b2', NULL, '28857d87-4710-4551-a507-388367e6a420', 's256', 'Z-en-kYRm8z36Rn7TU-gYh-uhJ4Xim0onIccJbEwFug', 'google', '', '', '2024-05-03 10:03:28.981077+00', '2024-05-03 10:03:28.981077+00', 'oauth', NULL),
	('5eac5ac1-6135-4a1b-92a2-5fedc24d8268', NULL, '99d42ac8-1d08-4213-8cd0-7218b653e3a4', 's256', 'uAEA1B9U1cwjHv4UEFgiSflVpZsn5f6oGF9iYCqcMEU', 'google', '', '', '2024-05-04 16:14:32.146598+00', '2024-05-04 16:14:32.146598+00', 'oauth', NULL),
	('079e40bb-4818-4766-b1de-59d8ea2f40ec', '212c8cf9-23e4-4c1a-8067-4cc7db61992e', '32cdde58-a265-4446-a37f-37fcf0df565e', 's256', 'V-tNZJ6gbUVL4zYzgNNyu0XxJloy9uNHeK29sTIXU-g', 'google', '', '', '2024-05-03 10:04:45.478129+00', '2024-05-03 10:06:10.707817+00', 'oauth', '2024-05-03 10:06:10.707769+00'),
	('8ea5ea05-2531-4cc3-bdfa-e5e7e6619eb1', NULL, 'f9ad4ee8-6129-44e4-a2c2-748ff00e6e15', 's256', 'uAEA1B9U1cwjHv4UEFgiSflVpZsn5f6oGF9iYCqcMEU', 'google', '', '', '2024-05-04 16:14:48.974929+00', '2024-05-04 16:14:48.974929+00', 'oauth', NULL),
	('1fd94144-1bb9-4d9c-8261-b9b061529e41', '56c3dd3a-1698-4a1b-aa70-df57a93649e0', 'cfb3bfd9-1805-4346-837b-d53afd8d0626', 's256', 'NhBxbWhihG0HfqkjB003CrsBwpcy1fzrzX9CuJPQI4I', 'google', '', '', '2024-05-04 06:40:23.053097+00', '2024-05-04 06:44:49.739348+00', 'oauth', '2024-05-04 06:44:49.739298+00'),
	('1d224f6d-17be-418c-b693-465390cbcbaa', '56c3dd3a-1698-4a1b-aa70-df57a93649e0', '11f543d2-2ba5-43f7-8a87-60441920738e', 's256', '8FW5QVrhKLdDfYx82fOYQ98QNiFzZBQYcMxnplDthvI', 'google', '', '', '2024-05-04 06:50:20.010945+00', '2024-05-04 06:50:24.026892+00', 'oauth', '2024-05-04 06:50:24.02684+00'),
	('a27f64ee-b2d7-4234-a8e7-abe73ade6934', '56c3dd3a-1698-4a1b-aa70-df57a93649e0', '73ad7c18-8792-4512-8957-3180c0301fb5', 's256', 'hZ8owjOZd7jE_wAgD75cq4Wftl4n7c9xfhvvaxQDCu8', 'google', '', '', '2024-05-04 10:00:07.438169+00', '2024-05-04 10:00:14.319849+00', 'oauth', '2024-05-04 10:00:14.319795+00'),
	('0dee4523-2b9f-4cb3-abc8-7e7508980542', '56c3dd3a-1698-4a1b-aa70-df57a93649e0', 'f0184b27-9526-4044-9b28-baf909dc256e', 's256', 'CCNu7oaLUi3fr20Z6j6eYN-pw1XAobjc7U9FkB1TN_s', 'google', '', '', '2024-05-04 10:01:06.78967+00', '2024-05-04 10:01:12.999079+00', 'oauth', '2024-05-04 10:01:12.99902+00'),
	('d1344c49-0018-4992-aa0b-fcead346eb3e', '56c3dd3a-1698-4a1b-aa70-df57a93649e0', 'c8366f7e-b487-4064-a260-f866244faacb', 's256', '5-cKruddiWXdx8CeZwg3p9YS0690SPR9xlMZhUXAQQ0', 'google', '', '', '2024-05-04 10:01:50.204033+00', '2024-05-04 10:02:21.96805+00', 'oauth', '2024-05-04 10:02:21.968002+00'),
	('6ab8c2d4-f5f6-49cc-9240-745bad130f30', '56c3dd3a-1698-4a1b-aa70-df57a93649e0', 'c99974ae-67cd-46f3-a82c-f52e6581fc87', 's256', 'gjdv-MSf8iFBK_-UST7gmvOpiyMRIV57XftZgaIZwEM', 'google', '', '', '2024-05-04 10:02:48.443896+00', '2024-05-04 10:02:58.687397+00', 'oauth', '2024-05-04 10:02:58.687352+00'),
	('5aa4c360-b3cf-4d34-81f1-daa0a4cc90b2', '56c3dd3a-1698-4a1b-aa70-df57a93649e0', '1e643583-be49-49f7-804b-98dd63f0595d', 's256', 'W7qlDh3NhAmWrAh9LKhrRbdaeTeoEM61q8DswE_qujk', 'google', '', '', '2024-05-04 10:21:45.177962+00', '2024-05-04 10:23:46.308744+00', 'oauth', '2024-05-04 10:23:46.308696+00'),
	('9dc59b5f-99c4-4088-9b6c-c43ffc7f8567', '212c8cf9-23e4-4c1a-8067-4cc7db61992e', '7819d88c-0707-4fbb-82a8-c0436ab926e5', 's256', 'gZePDMUGhlXss1CNnTMYtTFIToulwYoTaHNFKruw4Ew', 'google', '', '', '2024-05-04 14:12:59.427839+00', '2024-05-04 14:13:08.787959+00', 'oauth', '2024-05-04 14:13:08.787917+00'),
	('09d6128d-7d77-46b7-9d0b-5f60f4f24df4', NULL, '9478a985-7565-4867-b369-8d563662ed78', 's256', 'I0Ga-5Hh26Y7tD0R46nJZRW32cyDrY7QKT07j1dlZiM', 'google', '', '', '2024-05-04 14:34:06.536963+00', '2024-05-04 14:34:06.536963+00', 'oauth', NULL),
	('731c67af-e090-42f9-9334-6355390ce015', NULL, 'a2f39239-48b0-4f55-9970-c6f80156231b', 's256', 'j09RfXEnEroygXvZ3Knlg7M5nLvvPFGAZlOcVB5Juuc', 'google', '', '', '2024-05-04 14:34:17.253508+00', '2024-05-04 14:34:17.253508+00', 'oauth', NULL),
	('d2a398c2-53bb-47cc-bc70-d0544aa1f021', NULL, '0e401c20-43fc-48b9-b271-ab156c652744', 's256', '8OHFD0tW94CukJ8bkihGEw4yZ6toaNXNl8op_8si-GA', 'google', '', '', '2024-05-04 14:34:22.416385+00', '2024-05-04 14:34:22.416385+00', 'oauth', NULL),
	('ec94774b-fd66-4456-baa2-f0725c00da86', '212c8cf9-23e4-4c1a-8067-4cc7db61992e', '89ead529-9758-4247-9917-7e5305b5c54c', 's256', 'UpgGxApPQM1fj1Lj422-fJRzH3_6acpPAgT4rxkMXY8', 'google', '', '', '2024-05-04 14:39:04.809052+00', '2024-05-04 14:40:12.134508+00', 'oauth', '2024-05-04 14:40:12.134464+00'),
	('17938582-35ae-4d85-b64a-9fc9b753a9c2', '1d4a3b9d-3950-424d-94d3-717d46851eb4', '427740fa-495e-45aa-865e-bef69f9638d8', 's256', 'YtnM7BGeazOl_9H3MyyJUmC09vAWBZS1kUfLCO7tMA8', 'google', '', '', '2024-05-04 14:49:09.809387+00', '2024-05-04 14:49:15.089648+00', 'oauth', '2024-05-04 14:49:15.089588+00'),
	('6bb0ac5b-0de0-4567-85d8-9624835412cc', NULL, '85cc4644-b0ec-4dba-84c9-86cc5adc3ae9', 's256', '3Vy2fut9i4aZt9yfOtjVZNgkGW_FWwloVR3_bnM6cdc', 'google', '', '', '2024-05-04 14:51:37.851666+00', '2024-05-04 14:51:37.851666+00', 'oauth', NULL),
	('9c191161-7f38-4634-97cf-6f0e19ce593b', NULL, '101c7b68-f4b5-428c-889c-8de9fbf510e7', 's256', 'Luj98mJ0ap30oHwTKHuRjKef6_xMUVG9h8MalWThBCA', 'google', '', '', '2024-05-04 14:51:45.232965+00', '2024-05-04 14:51:45.232965+00', 'oauth', NULL),
	('f8a21bf9-186a-490e-ae2b-b67344c9e123', NULL, '9697f537-ca4a-43b0-83d9-4e83be041a67', 's256', 'uTZVSkDwxT0Ly44rTDSQYm4dkVkKdMObFB2P29L8Kt0', 'google', '', '', '2024-05-04 14:53:05.141047+00', '2024-05-04 14:53:05.141047+00', 'oauth', NULL),
	('180013dd-12b3-4717-856f-02d76fefd1f2', NULL, '0f0dc198-a36e-493b-a69f-e6c6ed7e6442', 's256', 'qF-DW2V8yiOU6dvTE67YPiqbF2jzldXfJWdv-99L8qM', 'google', '', '', '2024-05-04 14:55:34.671237+00', '2024-05-04 14:55:34.671237+00', 'oauth', NULL),
	('85cc4757-81f2-4ca5-82f3-2701047fabab', NULL, '54e42698-99f2-4701-8ef4-9cae570099a9', 's256', 'SOEHTTxWJiV8QEXXoY-dtlwsVBFA7Ze4E_aU6if_DR8', 'google', '', '', '2024-05-04 14:56:20.136235+00', '2024-05-04 14:56:20.136235+00', 'oauth', NULL),
	('f034fba5-edb1-44cb-a5af-ce69845ac963', '56c3dd3a-1698-4a1b-aa70-df57a93649e0', '70745252-ff78-49c4-ad9c-a5cb491fbad9', 's256', 'AzTjTJ7CtOfo5U2mGHUEM7qOV3AgHNQRd4l6o0GSXAI', 'google', '', '', '2024-05-04 15:12:16.217454+00', '2024-05-04 15:12:20.030582+00', 'oauth', '2024-05-04 15:12:20.03051+00'),
	('7b48803a-0667-477c-a11e-18d30233d3dd', '212c8cf9-23e4-4c1a-8067-4cc7db61992e', 'd037d0ea-b762-472a-9f04-57a84fcc0a63', 's256', '3kpvHY9DCy14jPAnEDrcMuxXuPpQS2mZ6JVjSR2_Ews', 'google', '', '', '2024-05-04 16:21:57.769474+00', '2024-05-04 16:22:00.715399+00', 'oauth', '2024-05-04 16:22:00.715356+00'),
	('bdd8e4cb-92a9-4450-8ae6-33aa870d925c', '212c8cf9-23e4-4c1a-8067-4cc7db61992e', 'b808086d-94dd-4ae1-b6ea-3a3c788d4e10', 's256', 'yNsd1cX8_JysTyDLZXI5ORc-j8u5TmqQ8rGocqxAio8', 'google', '', '', '2024-05-04 15:33:06.963683+00', '2024-05-04 15:33:11.112264+00', 'oauth', '2024-05-04 15:33:11.112212+00'),
	('186f62d9-24b2-42c1-8f57-908a4d193b28', '212c8cf9-23e4-4c1a-8067-4cc7db61992e', 'f9eef65f-0c90-4454-a76c-27cd37a9230e', 's256', '1VAzRduHuJ3f8U6Qk37n1PzDvQPDCdYzsP9SMVapm0c', 'google', '', '', '2024-05-04 16:27:25.707477+00', '2024-05-04 16:27:27.951641+00', 'oauth', '2024-05-04 16:27:27.951584+00'),
	('29f50530-81e7-4e6c-bee9-b1ff69b82ae3', '212c8cf9-23e4-4c1a-8067-4cc7db61992e', 'dc41a3a1-3dc3-4a93-bd43-9334a9356fe9', 's256', 'Tc6SD0WpabZFjY0oRRhc5hdLhdttT-xpzeFjmju7WgU', 'google', '', '', '2024-05-04 15:38:55.913091+00', '2024-05-04 15:39:04.583997+00', 'oauth', '2024-05-04 15:39:04.583956+00'),
	('79494c7c-11cb-4498-9c3d-5c62ec18cf97', '212c8cf9-23e4-4c1a-8067-4cc7db61992e', '84b37b3c-af3e-4ad8-8049-9b49cc8c8150', 's256', 'FGN_lO6m0csMcUGXEjHRPtKoHl_wPqi6_1l5azY7eFk', 'google', '', '', '2024-05-04 15:39:21.606834+00', '2024-05-04 15:39:25.575862+00', 'oauth', '2024-05-04 15:39:25.575815+00'),
	('44f6b4d4-a911-4673-bdaa-aacc80135e5c', NULL, '4658172f-f0bc-43d2-8ade-a24854af0f62', 's256', 'NlxqC6RRCazh0z_wukz6uf_trLx2csMZ3DGf7BKeXCw', 'google', '', '', '2024-05-04 15:55:36.741904+00', '2024-05-04 15:55:36.741904+00', 'oauth', NULL),
	('0138100e-d5dd-494b-9305-cde85d8fb0fe', '212c8cf9-23e4-4c1a-8067-4cc7db61992e', '7fc662b7-235c-440b-9b85-ea18323c660c', 's256', '5oa1AjKFQCzSEKLwkIMGREw7cljSAcXN_FZ0ytmKD7E', 'google', '', '', '2024-05-04 16:30:25.690988+00', '2024-05-04 16:30:30.825394+00', 'oauth', '2024-05-04 16:30:30.82535+00'),
	('e436b84b-17e9-4c98-b8bb-170a0a3a17b6', '212c8cf9-23e4-4c1a-8067-4cc7db61992e', '06478e54-1218-47a7-94df-08626ae463f8', 's256', '8U7_za8zjlAxq6mz-G4DlaXORP-PhuO78DHOYLpC2cc', 'google', '', '', '2024-05-04 17:17:53.189691+00', '2024-05-04 17:17:57.313284+00', 'oauth', '2024-05-04 17:17:57.313232+00'),
	('6bbc60d7-77f0-4b48-a291-f43403180d51', '212c8cf9-23e4-4c1a-8067-4cc7db61992e', 'f87fb1f9-6e31-454c-b8f5-5113d30c3ed7', 's256', 'vCig_DBZDxewhSQCtmNtZ0SkoCp0k_4Kvtl_9iC9b7E', 'google', '', '', '2024-05-04 15:59:42.046798+00', '2024-05-04 15:59:46.130975+00', 'oauth', '2024-05-04 15:59:46.130922+00'),
	('a0d77b5c-d4e8-4b29-b886-3337e501b89c', '212c8cf9-23e4-4c1a-8067-4cc7db61992e', 'c1bc313d-8728-4875-8377-fc0587de3531', 's256', 'exKxeicN_hkrVDMluL4u2y39nDxx_f_4lMF-YIE064Y', 'google', '', '', '2024-05-04 16:05:41.42197+00', '2024-05-04 16:05:49.339035+00', 'oauth', '2024-05-04 16:05:49.338992+00'),
	('4d084b6d-efa2-49f4-a035-fd6e95ceff3a', NULL, '75de60da-35c2-4afd-a718-a086c314c28b', 's256', 'PU48VpmIFz9K6NJQAjQqS_hOd391xB5eXHvEJpM4wvw', 'google', '', '', '2024-05-04 16:10:54.724332+00', '2024-05-04 16:10:54.724332+00', 'oauth', NULL),
	('f82c3795-4eac-4592-85d3-e1b5f203f420', NULL, 'cff4c21c-04b6-4a78-9541-d7956ee48145', 's256', 'pt7W9SzQfbQQ_y1DXcE7_yaPe7XfkzSaHQSIoI99S_w', 'google', '', '', '2024-05-04 16:11:07.812795+00', '2024-05-04 16:11:07.812795+00', 'oauth', NULL),
	('d1128e7d-3e9a-4808-9680-dbb3f9bb505e', NULL, '3ff368d5-9103-424d-8041-10831604cfc5', 's256', 'lXCWwqeiXT_vjJxiT446zImXPlOO3SWfIO-Kvfeua-s', 'google', '', '', '2024-05-04 16:11:29.172759+00', '2024-05-04 16:11:29.172759+00', 'oauth', NULL),
	('37e0efe3-bd53-4a8f-bfcb-b9c664051747', '212c8cf9-23e4-4c1a-8067-4cc7db61992e', 'f5cfeab3-8a13-4fcf-af78-0cd891934936', 's256', 'TTHJ2VW43Z7Km5gznx9vvVX2fu-Ao4j_g9Y4vTOt9V0', 'google', '', '', '2024-05-04 17:21:02.245354+00', '2024-05-04 17:21:09.235707+00', 'oauth', '2024-05-04 17:21:09.23566+00'),
	('14b7fef9-aaba-4223-8ebc-4b9ccb8bbb6a', '212c8cf9-23e4-4c1a-8067-4cc7db61992e', 'de550376-c8f0-470f-9adf-f3299067578c', 's256', 'T_btv8O-dhMFTdehVu4lVHcd4w5UJNQ3Qnz1pNKvEd0', 'google', '', '', '2024-05-04 17:28:22.103852+00', '2024-05-04 17:28:26.397544+00', 'oauth', '2024-05-04 17:28:26.397493+00'),
	('beeadc7c-897f-4f56-9b54-c58d56ce37c8', '212c8cf9-23e4-4c1a-8067-4cc7db61992e', '868cd596-c18c-4ab7-ba22-fbf90c2af73e', 's256', '61TDQyvtN1VP6IIToeqzQzkM4O52r31koOOX6HptFbg', 'google', '', '', '2024-05-04 17:37:41.915746+00', '2024-05-04 17:37:48.080504+00', 'oauth', '2024-05-04 17:37:48.080457+00'),
	('09c84dbd-23e3-42e6-a92a-127b31e10ae2', NULL, '23a47c05-d1ac-45bc-9724-d006faa3ab36', 's256', 'UQdUsFZbv1_YgHYT0EWDa4ErnxVwumFrxfr6bm3yvH4', 'google', '', '', '2024-05-05 07:17:56.861251+00', '2024-05-05 07:17:56.861251+00', 'oauth', NULL),
	('0c1f665b-9ef1-4188-acf4-f94506e6fae2', NULL, 'cc9864d7-fdcf-43f2-9492-cc79e743216b', 's256', 'g4imPzku0RYHIOoksDInNBrfeG16H0kELuw0Gz-ik5Q', 'google', '', '', '2024-05-05 07:18:51.912709+00', '2024-05-05 07:18:51.912709+00', 'oauth', NULL),
	('688d48e7-ac4e-47f2-b0f7-9bf7a3617244', NULL, 'e1c8b3a2-9e2c-4e9b-b680-6937fe7048f3', 's256', 'bu3Qd4-7VqNWEhOXhmW-ni_LbdxLSrzuYi2sv2dJ6FA', 'google', '', '', '2024-05-05 15:15:34.228022+00', '2024-05-05 15:15:34.228022+00', 'oauth', NULL),
	('325391bc-c965-457c-bf90-fe8c7bed9e61', '212c8cf9-23e4-4c1a-8067-4cc7db61992e', '34f8e884-2bc0-4e23-a876-b6e388c8f737', 's256', 'c9cJqxWPRT3ENvt727pVF2zGbXEX--j4Ae9qS2C6e4Y', 'google', '', '', '2024-05-05 14:37:17.94301+00', '2024-05-05 14:37:20.850325+00', 'oauth', '2024-05-05 14:37:20.850278+00'),
	('44a7994b-fc19-4853-a0d8-c7c36c3e6028', '56c3dd3a-1698-4a1b-aa70-df57a93649e0', '6109c758-a226-4f63-b460-c78e2c081aab', 's256', 'RBDfESsNkf_KltgrjG4pLAOT068esFSU9fz0lmTz4BE', 'magiclink', '', '', '2024-05-05 07:30:25.106318+00', '2024-05-05 07:30:25.106318+00', 'magiclink', NULL),
	('748c31c9-fdcc-4ff0-a952-1d487f76acba', '212c8cf9-23e4-4c1a-8067-4cc7db61992e', 'a58f7955-a8c0-4375-86c1-d13fde01861d', 's256', 'rFb8SRxlvguif_EXWX55yzVj6zFy9lKrdMp5gwVMXF4', 'google', '', '', '2024-05-05 14:37:44.585902+00', '2024-05-05 14:37:47.23525+00', 'oauth', '2024-05-05 14:37:47.235194+00'),
	('f004620c-349a-4d0b-ad94-1297bee36d8e', '212c8cf9-23e4-4c1a-8067-4cc7db61992e', '36b4edb9-066c-4d0f-b353-0888c9eef66a', 's256', 'BP7DPpmWTCWqEFYQTVGSVjr1kSvrSQ9pv7FA6jz9Mq4', 'google', '', '', '2024-05-05 14:39:21.422518+00', '2024-05-05 14:39:24.167833+00', 'oauth', '2024-05-05 14:39:24.167786+00');


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '5df733d7-d4b5-4b66-affe-8bfc55ab72c6', 'authenticated', 'authenticated', 'heavendogg@gmail.com', '$2a$10$o7BARHwz4kcUUuvWEYOm7ewBjcB4CnlpIJ56GgPaUC.xO3hOimW0S', '2024-05-04 07:51:47.999804+00', NULL, '', NULL, '', '2024-05-04 07:56:40.203745+00', '', '', NULL, '2024-05-04 09:21:20.254914+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-05-04 07:51:47.9956+00', '2024-05-04 09:21:20.257656+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '1d4a3b9d-3950-424d-94d3-717d46851eb4', 'authenticated', 'authenticated', 'muahanggiatot.live@gmail.com', '', '2024-05-04 14:35:13.052842+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-05-04 14:38:55.515855+00', '{"provider": "google", "providers": ["google"]}', '{"iss": "https://accounts.google.com", "sub": "112385429965722409735", "name": "Lộc Hoàng Công", "email": "muahanggiatot.live@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocJdXYUavs7JoKnc08AaJG-8B0XevAb2mz4hQrvc5J6HMdyZrg=s96-c", "full_name": "Lộc Hoàng Công", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocJdXYUavs7JoKnc08AaJG-8B0XevAb2mz4hQrvc5J6HMdyZrg=s96-c", "provider_id": "112385429965722409735", "email_verified": true, "phone_verified": false}', NULL, '2024-05-04 14:35:13.034+00', '2024-05-04 14:49:15.088386+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '56c3dd3a-1698-4a1b-aa70-df57a93649e0', 'authenticated', 'authenticated', 'thoqb123456@gmail.com', '$2a$10$F.6ajheCeU2BLX5zVF0KVuvzUz.Abj1E1opltp14A19JYt3fscV6S', '2024-05-03 10:08:03.786652+00', NULL, '', NULL, '', '2024-05-05 07:43:57.013449+00', '', '', NULL, '2024-05-05 07:44:08.705584+00', '{"provider": "email", "providers": ["email", "google"]}', '{"iss": "https://accounts.google.com", "sub": "109180128845443558661", "name": "Thọ Hoàng Công", "email": "thoqb123456@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocKDXhc9JfrxJ-dL_kLh-Iumu3gW4a0C1ceZjs4ZbZey8LrjSQc=s96-c", "full_name": "Thọ Hoàng Công", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocKDXhc9JfrxJ-dL_kLh-Iumu3gW4a0C1ceZjs4ZbZey8LrjSQc=s96-c", "provider_id": "109180128845443558661", "email_verified": true, "phone_verified": false}', NULL, '2024-05-03 10:08:03.783807+00', '2024-05-05 08:50:16.758258+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '212c8cf9-23e4-4c1a-8067-4cc7db61992e', 'authenticated', 'authenticated', 'tanthuqb91@gmail.com', '', '2024-05-03 10:06:10.7071+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-05-05 15:19:22.648235+00', '{"provider": "google", "providers": ["google"]}', '{"iss": "https://accounts.google.com", "sub": "116402142171104621781", "name": "Loc Hoang", "email": "tanthuqb91@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocJeh04-6NhReD_36omvoLLjWt8Xfzv3yTCfUIk-F14xuM2Lvg=s96-c", "full_name": "Loc Hoang", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocJeh04-6NhReD_36omvoLLjWt8Xfzv3yTCfUIk-F14xuM2Lvg=s96-c", "provider_id": "116402142171104621781", "email_verified": true, "phone_verified": false}', NULL, '2024-05-03 10:06:10.695073+00', '2024-05-05 15:19:22.649675+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('56c3dd3a-1698-4a1b-aa70-df57a93649e0', '56c3dd3a-1698-4a1b-aa70-df57a93649e0', '{"sub": "56c3dd3a-1698-4a1b-aa70-df57a93649e0", "email": "thoqb123456@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2024-05-03 10:08:03.7848+00', '2024-05-03 10:08:03.784858+00', '2024-05-03 10:08:03.784858+00', '2ad719da-b711-4aee-8dff-0bc60627f336'),
	('112385429965722409735', '1d4a3b9d-3950-424d-94d3-717d46851eb4', '{"iss": "https://accounts.google.com", "sub": "112385429965722409735", "name": "Lộc Hoàng Công", "email": "muahanggiatot.live@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocJdXYUavs7JoKnc08AaJG-8B0XevAb2mz4hQrvc5J6HMdyZrg=s96-c", "full_name": "Lộc Hoàng Công", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocJdXYUavs7JoKnc08AaJG-8B0XevAb2mz4hQrvc5J6HMdyZrg=s96-c", "provider_id": "112385429965722409735", "email_verified": true, "phone_verified": false}', 'google', '2024-05-04 14:35:13.04164+00', '2024-05-04 14:35:13.041701+00', '2024-05-04 14:49:15.086594+00', 'b08b24c3-2886-4083-a56f-27a243e1488c'),
	('109180128845443558661', '56c3dd3a-1698-4a1b-aa70-df57a93649e0', '{"iss": "https://accounts.google.com", "sub": "109180128845443558661", "name": "Thọ Hoàng Công", "email": "thoqb123456@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocKDXhc9JfrxJ-dL_kLh-Iumu3gW4a0C1ceZjs4ZbZey8LrjSQc=s96-c", "full_name": "Thọ Hoàng Công", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocKDXhc9JfrxJ-dL_kLh-Iumu3gW4a0C1ceZjs4ZbZey8LrjSQc=s96-c", "provider_id": "109180128845443558661", "email_verified": true, "phone_verified": false}', 'google', '2024-05-04 06:40:01.02416+00', '2024-05-04 06:40:01.024232+00', '2024-05-05 06:59:57.859697+00', '2d13ba21-380e-4f85-956d-7e064e3bdb20'),
	('116402142171104621781', '212c8cf9-23e4-4c1a-8067-4cc7db61992e', '{"iss": "https://accounts.google.com", "sub": "116402142171104621781", "name": "Loc Hoang", "email": "tanthuqb91@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocJeh04-6NhReD_36omvoLLjWt8Xfzv3yTCfUIk-F14xuM2Lvg=s96-c", "full_name": "Loc Hoang", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocJeh04-6NhReD_36omvoLLjWt8Xfzv3yTCfUIk-F14xuM2Lvg=s96-c", "provider_id": "116402142171104621781", "email_verified": true, "phone_verified": false}', 'google', '2024-05-03 10:06:10.702915+00', '2024-05-03 10:06:10.702965+00', '2024-05-05 15:19:21.583736+00', 'd8fdeb9e-9ba4-40dc-8cf2-7600447322d6'),
	('5df733d7-d4b5-4b66-affe-8bfc55ab72c6', '5df733d7-d4b5-4b66-affe-8bfc55ab72c6', '{"sub": "5df733d7-d4b5-4b66-affe-8bfc55ab72c6", "email": "heavendogg@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2024-05-04 07:51:47.997161+00', '2024-05-04 07:51:47.997216+00', '2024-05-04 07:51:47.997216+00', 'a285036d-9ee4-4076-be62-0e8c9a02ce75');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('475b5a64-17de-45b4-b9de-5f60511706dc', '5df733d7-d4b5-4b66-affe-8bfc55ab72c6', '2024-05-04 09:21:20.254991+00', '2024-05-04 09:21:20.254991+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '42.115.222.3', NULL),
	('19683ff6-6382-460d-b29a-6c2c50cd2be7', '56c3dd3a-1698-4a1b-aa70-df57a93649e0', '2024-05-05 07:44:08.70566+00', '2024-05-05 08:50:16.764308+00', NULL, 'aal1', NULL, '2024-05-05 08:50:16.7642', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '42.115.222.3', NULL),
	('7c69d3f1-4349-4201-a057-63928bae8467', '1d4a3b9d-3950-424d-94d3-717d46851eb4', '2024-05-04 14:38:55.515935+00', '2024-05-04 14:38:55.515935+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', '42.115.222.3', NULL),
	('b6ed38cf-30b5-4b65-8e09-07caaaa504a4', '212c8cf9-23e4-4c1a-8067-4cc7db61992e', '2024-05-05 15:19:22.648311+00', '2024-05-05 15:19:22.648311+00', NULL, 'aal1', NULL, NULL, 'node', '42.115.222.3', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('475b5a64-17de-45b4-b9de-5f60511706dc', '2024-05-04 09:21:20.258236+00', '2024-05-04 09:21:20.258236+00', 'otp', '5aebb356-9ebe-48d3-ab2c-d402f97f0b82'),
	('19683ff6-6382-460d-b29a-6c2c50cd2be7', '2024-05-05 07:44:08.708076+00', '2024-05-05 07:44:08.708076+00', 'magiclink', 'b2cb9202-50d7-4b5e-9570-0fee60bc5bf5'),
	('7c69d3f1-4349-4201-a057-63928bae8467', '2024-05-04 14:38:55.520754+00', '2024-05-04 14:38:55.520754+00', 'oauth', '76127add-b081-43b8-bc8c-269ac0a21e98'),
	('b6ed38cf-30b5-4b65-8e09-07caaaa504a4', '2024-05-05 15:19:22.649919+00', '2024-05-05 15:19:22.649919+00', 'oauth', 'e767cf6f-1fb7-4e2b-ab77-1c8a9e4ca77e');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 4, 'F6Awpv4TigEMB2VBLeOXvQ', '5df733d7-d4b5-4b66-affe-8bfc55ab72c6', false, '2024-05-04 09:21:20.256124+00', '2024-05-04 09:21:20.256124+00', NULL, '475b5a64-17de-45b4-b9de-5f60511706dc'),
	('00000000-0000-0000-0000-000000000000', 61, 'm7WvKuG360-1qjDk2ul4mw', '56c3dd3a-1698-4a1b-aa70-df57a93649e0', true, '2024-05-05 07:44:08.706469+00', '2024-05-05 08:50:16.749486+00', NULL, '19683ff6-6382-460d-b29a-6c2c50cd2be7'),
	('00000000-0000-0000-0000-000000000000', 62, 'O_uAqrWvuEDyj5jptODFlQ', '56c3dd3a-1698-4a1b-aa70-df57a93649e0', false, '2024-05-05 08:50:16.755911+00', '2024-05-05 08:50:16.755911+00', 'm7WvKuG360-1qjDk2ul4mw', '19683ff6-6382-460d-b29a-6c2c50cd2be7'),
	('00000000-0000-0000-0000-000000000000', 11, 'QdbkrfJSXi-A4qePhONb_A', '1d4a3b9d-3950-424d-94d3-717d46851eb4', false, '2024-05-04 14:38:55.517761+00', '2024-05-04 14:38:55.517761+00', NULL, '7c69d3f1-4349-4201-a057-63928bae8467'),
	('00000000-0000-0000-0000-000000000000', 73, 'EIPxQVIYCjXmQZw0ydyKEQ', '212c8cf9-23e4-4c1a-8067-4cc7db61992e', false, '2024-05-05 15:19:22.648888+00', '2024-05-05 15:19:22.648888+00', NULL, 'b6ed38cf-30b5-4b65-8e09-07caaaa504a4');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users" ("id", "created_at", "name", "username", "gender", "user_email_id", "updatedAt") VALUES
	('56c3dd3a-1698-4a1b-aa70-df57a93649e0', '2024-05-03 10:09:01.917239+00', 'Hoàng Công Thọ', 'Hoàng Thọ', 'Nam', '56c3dd3a-1698-4a1b-aa70-df57a93649e0', NULL);


--
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: feeds; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: comment_reactions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: feed_images; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: feed_reactions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: user_follows; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: verificationToken; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('suzu', 'suzu', NULL, '2024-05-03 07:24:46.666497+00', '2024-05-03 07:24:46.666497+00', false, false, NULL, NULL, NULL);


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id") VALUES
	('f1528009-5426-48e9-aada-7675d65e1a2d', 'suzu', '.emptyFolderPlaceholder', NULL, '2024-05-04 09:09:56.973895+00', '2024-05-04 09:09:56.973895+00', '2024-05-04 09:09:56.973895+00', '{"eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2024-05-04T09:09:57.000Z", "contentLength": 0, "httpStatusCode": 200}', 'edcbe5d8-0bb6-42d0-af06-2ae7b77f4c81', NULL);


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 73, true);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
