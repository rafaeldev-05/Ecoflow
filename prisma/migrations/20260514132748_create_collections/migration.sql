-- CreateEnum
CREATE TYPE "collection_status" AS ENUM ('agendada', 'em_transito', 'coletada', 'processando', 'concluida', 'cancelada');

-- CreateTable
CREATE TABLE "collections" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "material_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "status" "collection_status" NOT NULL DEFAULT 'agendada',
    "scheduled_date" DATE NOT NULL,
    "scheduled_time" TEXT,
    "pickup_address" TEXT NOT NULL,
    "notes" TEXT,
    "driver_name" TEXT,
    "driver_phone" TEXT,
    "collected_at" TIMESTAMPTZ(6),
    "completed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;
