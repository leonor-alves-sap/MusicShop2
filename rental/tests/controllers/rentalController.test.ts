import { rentalRepository } from "../../src/repository/rentalRepository";
import { Rental } from "../../src//domain/entity/rental";
import { rentalService } from "../../src/services/rentalService";
import axios, { AxiosResponse, AxiosError } from "axios";
import { error } from "console";
import { InsufficientFundsError, NoStockError } from "../../src/domain/errors";
