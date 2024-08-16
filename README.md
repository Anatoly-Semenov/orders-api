# Сотрудники

- Бухгалтер
- Менеджер (leader)
- Сотрудник - рядовой сотрудник

- Админ - главный клиент

clientAdmin
clientManager
clientEmployee
clientAccountant
ownerAdmin
ownerManager
ownerSupport
subClient

# Роли доступа

## Users

### add

- ClientAdmin
  -- clientManager
  -- clientEmployee
  -- clientAccountant
  -- subClient

- ClientManager
  -- clientEmployee
  -- clientAccountant
  -- subClient

- ClientEmployee
- ClientAccountant
- SubClient

- OwnerManager
  -- clientAdmin
  -- clientManager
  -- clientEmployee
  -- clientAccountant
  -- subClient

- OwnerSupport
  -- clientAdmin
  -- clientManager
  -- clientEmployee
  -- clientAccountant
  -- subClient

### update

- ClientAdmin
  -- clientManager
  -- clientEmployee
  -- clientAccountant
  -- subClient

- ClientManager
  -- clientEmployee
  -- clientAccountant
  -- subClient

- ClientEmployee
- ClientAccountant
- SubClient

- OwnerManager
  -- clientAdmin
  -- clientManager
  -- clientEmployee
  -- clientAccountant
  -- subClient

- OwnerSupport
  -- clientAdmin
  -- clientManager
  -- clientEmployee
  -- clientAccountant
  -- subClient

### delete

- ClientAdmin
  -- clientManager
  -- clientEmployee
  -- clientAccountant
  -- subClient
- ClientManager
- ClientEmployee
- ClientAccountant
- SubClient

- OwnerManager
  -- clientAdmin
  -- clientManager
  -- clientEmployee
  -- clientAccountant
  -- subClient

- OwnerSupport

### clone

- ClientAdmin
  -- clientManager
  -- clientEmployee
  -- clientAccountant
  -- subClient

- ClientManager
  -- clientEmployee
  -- clientAccountant
  -- subClient

- ClientEmployee
- ClientAccountant
- SubClient

- OwnerManager
  -- clientAdmin
  -- clientManager
  -- clientEmployee
  -- clientAccountant
  -- subClient

- OwnerSupport
  -- clientAdmin
  -- clientManager
  -- clientEmployee
  -- clientAccountant
  -- subClient

### forgot-password

- ClientAdmin
  -- clientManager
  -- clientEmployee
  -- clientAccountant
  -- subClient

- ClientManager
  -- clientEmployee
  -- clientAccountant
  -- subClient

- ClientEmployee
- ClientAccountant
- SubClient

- OwnerManager
  -- clientAdmin
  -- clientManager
  -- clientEmployee
  -- clientAccountant
  -- subClient

- OwnerSupport
  -- clientAdmin
  -- clientManager
  -- clientEmployee
  -- clientAccountant
  -- subClient

## notifications

### add

(Кто может в принципе создать кастомыный текст)

- ClientAdmin
- ClientManager
- OwnerManager

### delete

(Кто может в принципе удалить кастомыный текст)

- ClientAdmin
- ClientManager
- OwnerManager

### update

(Кто может в принципе обновить кастомыный текст)

- ClientAdmin
- ClientManager
- OwnerManager

### getOne

(Кто может в принципе получить кастомыный текст)

- ClientAdmin
- ClientManager
- OwnerManager
- OwnerSupport

### getAll

(Кто может в принципе получить кастомыный текст)

- ClientAdmin
- ClientManager
- OwnerManager
- OwnerSupport

## Clients

### add

- ClientAdmin
- OwnerManager
- OwnerSupport

### getAll

- ClientAdmin
- OwnerManager
- OwnerSupport

### getOne

(доступен для всех)

### clone

- ClientAdmin
- OwnerManager
- OwnerSupport

### delete

- ClientAdmin
- OwnerManager

### update

- ClientAdmin
- OwnerManager
- OwnerSupport

### get client users list

- ClientAdmin
- ClientManager
- OwnerManager
- OwnerSupport
- ClientEmployee (Ограничение через фронт - видит только субклиентов)

## services

## add

- ClientAdmin
- ClientManager
- OwnerManager
- OwnerSupport

## update

- ClientAdmin
- ClientManager
- OwnerManager
- OwnerSupport

## clone

- ClientAdmin
- ClientManager
- OwnerManager
- OwnerSupport

## delete

- ClientAdmin
- OwnerManager

## getAll

- ClientAdmin
- ClientManager
- OwnerManager
- OwnerSupport
- SubClient
  (И для всех невторизованных пользователей со стороны субклиентского интерфейса)

## getOne

(Для всех)

## client app payments

(То как платит субклиент, настройки на строне клиентского приложения)

### add

- СlientAdmin
- OwnerAdmin

### update

- СlientAdmin
- OwnerAdmin

### delete

- СlientAdmin
- OwnerAdmin

### getOne

- ClientAdmin
- ClientManager (Ограничить видимость настроек платежей на фронтенде)
- OwnerManager
- OwnerSupport

### getAll

- ClientAdmin
- ClientManager (Ограничить видимость настроек платежей на фронтенде)
- OwnerManager
- OwnerSupport

## Orders

### add

- ClientAdmin
- ClientManager
- ClientEmployee
- OwnerManager
- OwnerSupport
- SubClient
  (Любой не авторизованный пользователь)

### update

- ClientAdmin
- ClientManager
- ClientEmployee
- OwnerManager
- OwnerSupport

### delete

- ClientAdmin
- OwnerManager

### getOne

- ClientAdmin
- ClientManager
- ClientEmployee
- OwnerManager
- OwnerSupport
- СlientAccountant
- SubClient

### getAll

- ClientAdmin
- ClientManager
- ClientEmployee
- OwnerManager
- OwnerSupport
- СlientAccountant
- SubClient

## bookings

### add

- ClientAdmin
- ClientManager
- ClientEmployee
- OwnerManager
- OwnerSupport
- SubClient
  (Любой не авторизованный пользователь)

### update

- ClientAdmin
- ClientManager
- ClientEmployee
- OwnerManager
- OwnerSupport

### delete

- ClientAdmin
- OwnerManager

### getOne

- ClientAdmin
- ClientManager
- ClientEmployee
- OwnerManager
- OwnerSupport
- СlientAccountant
- SubClient

### getAll

- ClientAdmin
- ClientManager
- ClientEmployee
- OwnerManager
- OwnerSupport
- СlientAccountant
- SubClient

## Booking payments

### add

- ClientAdmin
- ClientManager
- ClientEmployee
- OwnerManager
  (Могут добавлять оплату != онлайн | == наличные/РС и тд)
- SubClient (Если order онлайн с оплатой со стороны субклиентского интерфейса)
  (Любой не авторизованный пользователь если order онлайн с оплатой со стороны субклиентского интерфейса)

### update

- ClientAdmin
- ClientManager
- ClientEmployee
- OwnerManager
  (Могут менять оплату != онлайн | == наличные/РС и тд)

### delete

- ClientAdmin
- ClientManager
- ClientEmployee
- OwnerManager
  (Могут удалить оплату != онлайн | == наличные/РС и тд)

### getOne

- ClientAdmin
- ClientManager
- ClientEmployee
- OwnerManager
- OwnerSupport
- СlientAccountant
- SubClient

### getAll

- ClientAdmin
- ClientManager
- ClientEmployee
- OwnerManager
- OwnerSupport
- СlientAccountant
- SubClient

## User Schedules

### create

- ClientAdmin
- ClientManager
- OwnerManager

### get all

- ClientAdmin
- ClientManager
- ClientEmployee
- OwnerManager
- OwnerSupport
- СlientAccountant
- SubClient
  (+ Не авторизованный пользователь)

### delete

- ClientAdmin
- ClientManager
- OwnerManager

## service categories

## add

- ClientAdmin
- ClientManager
- OwnerManager
- OwnerSupport

### update

- ClientAdmin
- ClientManager
- OwnerManager
- OwnerSupport

### delete

- ClientAdmin
- OwnerManager

### getAll

- ClientAdmin
- ClientManager
- OwnerManager
- OwnerSupport
- SubClient
  (И для всех невторизованных пользователей со стороны субклиентского интерфейса)

### getOne

(Для всех)

- clientAdmin
- clientManager
- clientEmployee
- clientAccountant
- ownerAdmin
- ownerManager
- ownerSupport
- subClient

## Clients app categories

### add category

- ownerAdmin
- ownerManager

### delete category

- ownerAdmin
- ownerManager

### get one category

- All

### get all categories

- All

### update category

- ownerAdmin
- ownerManager

### add type

- ownerAdmin
- ownerManager

### delete type

- ownerAdmin
- ownerManager

### get one type

- All

### get all type

- All

### update type

- ownerAdmin
- ownerManager

# Фильтры для сущностей

## ✅ User

- ✅ Мета данные
- ✅ Email
- ✅ Связь с компанией
- ✅ По ролям
  для OwnerAdmin
- Фильтр по периоду **(Неоткуда брать даныне)**
- ✅ По стране // Связь с клиентским приложением
- ✅ По городу // Связь с клиентским приложением
- ✅ По адрессу // Связь с клиентским приложением
- ✅ По услуге

## ✅ Services-categories

- ✅ Название

## ✅ Services

- ✅ Название
- ✅ Категория
- ✅ По адрессу
- ✅ По сотруднику
- ✅ Формат услуги (для доп.услуги)
- ✅ По форме оплаты
- ✅ Тип аренды
- ✅ Тип бронирования
- ✅ Фильтр по основному и дополнительному типу
- ✅ По стоимости
- ✅ Включена/не включена
- ✅ По компании
- ✅ Выбор нужных услуг списком, ids ?
- По периоду **(Неоткуда брать даныне)**

## ✅ Bookings

- ✅ По ids
- ✅ По субклиенту (По номеру или email, id, по имени-фамилии) **(Только по id, телефону, почте)**
- ✅ По услугам (по всем)
- ✅ По основной услуге
- ✅ По статусу бронирования
- ✅ По оплате (По всем данным - бесплатная бронь, по типу оплаты, по статусу оплаты)
- ✅ По периоду
- ✅ По сотруднику (id, по имени-фамилии)
- ✅ По номеру заказа

## ✅ Orders

- ✅ По пользователю
- ✅ По id
- ✅ По периоду создания

## Client categories

- ✅ По названию категории
- ✅ По id

## Client types

- ✅ По названию типа
- ✅ По категории (id)
- ✅ По id

## Clients

- ✅ По id
- ✅ По тарифу ?
- Сколько подписки осталось по времени ?
- ✅ По названию
- ✅ По ссылке
- ✅ По активности
- ✅ По адрессу
  - ✅ По городу
  - ✅ По стране
- ✅ По мета данным
- По услуге

## Booking-payments

- ✅ По id
- ✅ По цене
- ✅ По статусу
- ✅ По типу
- ✅ По формату
- ✅ Бесплатное/платное
- ✅ По бронированию
- ✅ По пользователю


## GET ALL
users
users-schedule
service-categories
services
recurenst
rates
payements
orders
clients-categories
clients
address