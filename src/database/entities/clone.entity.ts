import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('clones')
@Index(['originalUrl'])
@Index(['createdAt'])
export class CloneEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 2048 })
  originalUrl!: string;

  @Column({ type: 'text' })
  clonedHtml!: string;

  @Column({ type: 'text', nullable: true })
  editedHtml!: string;

  @Column({ type: 'simple-json', nullable: true })
  metadata!: {
    title?: string;
    description?: string;
    siteTitle?: string;
    domain?: string;
    imageCount?: number;
    videoCount?: number;
    linkCount?: number;
  };

  @Column({ type: 'simple-json', nullable: true })
  removedElements!: {
    metaPixels?: number;
    analyticsScripts?: number;
    trackingScripts?: number;
    webhooks?: number;
  };

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status!: 'active' | 'archived' | 'deleted';
}
