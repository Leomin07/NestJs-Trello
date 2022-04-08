import Member from './member';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class MemberNotification {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
  id: number;

  @Column('tinyint', {
    name: 'is_read',
    default: 0,
    comment: '0: unread, 1: read',
    nullable: true,
  })
  isRead?: number;

  @Column('tinyint', {
    name: 'status',
    default: 0,
    comment: '0: not delete, 1: delete',
    nullable: true,
  })
  status?: number;

  /* -------------------------------------------------------------------------- */
  /*                                  Relation                                  */
  /* -------------------------------------------------------------------------- */

  @ManyToOne(() => Member)
  @JoinColumn({ name: 'member_id', referencedColumnName: 'id' })
  member: Member;

  @ManyToOne(() => Notification)
  @JoinColumn({ name: 'notification_id', referencedColumnName: 'id' })
  notification: Notification;
}
