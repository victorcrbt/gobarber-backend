import { ObjectID } from 'mongodb';

import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';

export default class FakeNotificationsRepository
  implements INotificationsRepository {
  private notifications: Notification[];

  constructor() {
    this.notifications = [];
  }

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification();

    Object.assign(notification, {
      id: new ObjectID(),
      content,
      recipient_id,
      created_at: new Date(Date.now()),
      updated_at: new Date(Date.now()),
    });

    this.notifications.push(notification);

    return notification;
  }

  public async findAll(): Promise<Notification[]> {
    return this.notifications;
  }
}
