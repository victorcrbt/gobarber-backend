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
      content,
      recipient_id,
    });

    this.notifications.push(notification);

    return notification;
  }
}
