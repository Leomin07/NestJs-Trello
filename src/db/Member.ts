import { MemberStatus, Gender } from '$types/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Exercise from './Exercise';
import Image from './Images';
import MemberNotification from './MemberNotification';
import RankChild from './RankChild';

@Entity('member')
export default class Member {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'phone', type: 'varchar', length: 20, nullable: false, unique: true })
  phone: string;

  @Column({ name: 'status', type: 'tinyint', comment: '1: active, 0: inactive', default: 1 })
  status: MemberStatus;

  @Column({ name: 'rank_id', type: 'tinyint', comment: "Member's rank. Get data from resource.", nullable: true })
  rankId: string;

  @Column({ name: 'point', type: 'bigint', default: 0, unsigned: true })
  point: string;

  @Column({ name: 'position', type: 'bigint', nullable: true, unsigned: true })
  position: string;

  @Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ name: 'gender', type: 'tinyint', nullable: true })
  gender: Gender;

  @Column({ name: 'birthday', type: 'varchar', length: 20, nullable: true })
  birthday: string;

  @Column({ name: 'address', type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({ name: 'url', type: 'varchar', length: 255, nullable: true })
  url: string;

  @Column({ name: 'intro', type: 'varchar', length: 255, nullable: true })
  intro: string;

  @Column({ name: 'change_phone_code', type: 'varchar', length: 20, nullable: true, select: false })
  changePhoneCode: string;

  @Column({
    name: 'refresh_token',
    type: 'varchar',
    length: 500,
    nullable: true,
    select: false,
  })
  refreshToken?: string;

  @Column({ name: 'deleted_at', type: 'datetime', nullable: true })
  deletedAt: string;

  @UpdateDateColumn({ name: 'update_at', type: 'datetime' })
  updateAt: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: string;

  /* -------------------------------------------------------------------------- */
  /*                                  Relation                                  */
  /* -------------------------------------------------------------------------- */
  @OneToMany(() => Image, (image) => image.member)
  images: Image[];

  @OneToMany(() => Exercise, (exercise) => exercise.member)
  exercises: Exercise[];

  @ManyToOne(() => RankChild)
  @JoinColumn({ name: 'rank_id', referencedColumnName: 'id' })
  rank: RankChild;

  @OneToMany(() => MemberNotification, (memberNotification) => memberNotification.member)
  memberNotification: MemberNotification;
}
