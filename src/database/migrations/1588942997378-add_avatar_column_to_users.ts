import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddAvatarColumnToUsers1588942997378
  implements MigrationInterface {
  private tableName = 'users';

  private column = new TableColumn({
    name: 'avatar',
    type: 'varchar',
    isNullable: true,
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(this.tableName, this.column);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(this.tableName, this.column);
  }
}
