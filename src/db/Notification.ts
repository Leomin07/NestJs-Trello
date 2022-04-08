import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import MemberNotification from './MemberNotification';

@Entity('notification')
export default class Notification {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
  id: number;
  @Column('int', {
    name: 'created_by',
    comment: 'Actor of notification',
    nullable: true,
  })
  createdBy?: number;
  @Column('tinyint', {
    name: 'type',
    comment: 'Type of notificaiton',
    nullable: true,
  })
  type?: number;
  @Column('int', {
    name: 'redirect_id',
    comment: 'Id to redirect',
    nullable: true,
  })
  redirectId?: number;
  @Column('tinyint', {
    name: 'redirect_type',
    comment: 'Type to redirect',
    nullable: true,
  })
  redirectType?: number;
  @Column('varchar', {
    name: 'title',
    comment: 'Title of notificaiton',
    nullable: true,
    length: 500,
  })
  title?: string;
  @Column('tinyint', {
    name: 'status',
    default: 1,
    comment: '1: Active, 0: Inactive',
    nullable: true,
  })
  status?: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt?: string;

  /* -------------------------------------------------------------------------- */
  /*                                  Relation                                  */
  /* -------------------------------------------------------------------------- */

  @OneToMany(() => MemberNotification, (member) => member.notification)
  memberNotification: MemberNotification[];
}
