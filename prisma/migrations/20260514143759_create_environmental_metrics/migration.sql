-- CreateTable
CREATE TABLE "environmental_metrics" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "period_start" DATE NOT NULL,
    "period_end" DATE NOT NULL,
    "total_weight_kg" DECIMAL(12,2) DEFAULT 0,
    "co2_avoided_kg" DECIMAL(12,2) DEFAULT 0,
    "collections_completed" INTEGER DEFAULT 0,
    "materials_recycled" INTEGER DEFAULT 0,
    "recycling_rate" DECIMAL(5,2) DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "environmental_metrics_pkey" PRIMARY KEY ("id")
);
